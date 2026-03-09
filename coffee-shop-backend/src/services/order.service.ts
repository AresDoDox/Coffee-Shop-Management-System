import prisma from '../prisma.js';
import { order_status } from '@prisma/client';
import { getIO } from '../socket.js';
import { validateVoucher } from './voucher.service.js';

interface OrderItemInput {
  productId: number;
  quantity: number;
}

export class OrderService {

    async getRecentOrders() {
        return prisma.order.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                orderitem: {
                    include: { product: true }
                }
            }
        });
    }

  async getActiveOrders() {
      return prisma.order.findMany({
          where: {
              status: {
                  in: [order_status.PENDING] // Add PROCESSING if valid
              }
          },
          orderBy: { createdAt: 'desc' },
          include: {
              orderitem: {
                  include: { product: true }
              }
          }
      });
  }
  
  // Create Order with Transaction (Nested Writes)
  async createOrder(userId: number, items: OrderItemInput[], paymentMethod: string = 'QR', voucherCode?: string) {
    // 1. Lấy thông tin sản phẩm từ Database để biết giá hiện tại
    // (Không tin giá từ Frontend gửi lên!)
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // 2. Tính toán tổng tiền & chuẩn bị dữ liệu
    let totalAmount = 0;

    // Map dữ liệu để chuẩn bị lưu vào bảng OrderItem
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
    
      if (!product) {
        throw new Error(`Sản phẩm ID ${item.productId} không tồn tại`);
      }

      // Tính tiền: Giá DB * Số lượng
      // Lưu ý: Trong dự án thật cần dùng thư viện decimal.js để tính tiền chính xác hơn
      const itemPrice = Number(product.price); 
      totalAmount += itemPrice * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice, // Lưu giá tại thời điểm bán (Snapshot)
      };
    });

    // 3. Xử lý Voucher (nếu có)
    let finalTotalAmount = totalAmount;
    let appliedVoucherId = null;
    let discountApplied = 0;

    if (voucherCode) {
      try {
        const { voucher, discountAmount } = await validateVoucher(voucherCode, totalAmount);
        appliedVoucherId = voucher.id;
        discountApplied = discountAmount;
        finalTotalAmount = Math.max(0, totalAmount - discountAmount);
      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        throw new Error(`Voucher error: ${errorMsg}`);
      }
    }

    // 4. Tạo Order và OrderItem cùng lúc (Transaction)
    // Prisma gọi đây là "Nested Write" - Ghi lồng nhau
    const newOrder = await prisma.$transaction(async (prismaProvider) => {
      const order = await prismaProvider.order.create({
      data: {
        userId: userId,
        totalAmount: finalTotalAmount,
        status: order_status.PENDING,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'CASH' ? 'PAID' : 'UNPAID',
        voucherId: appliedVoucherId,
        discount: discountApplied,
        orderitem: {
          create: orderItemsData
        }
      },
      include: {
        orderitem: {
            include: {
                product: true
            }
        } // Return the created items for confirmation
      }
    });

      // Nếu áp dụng voucher thành công, tăng usedCount lên 1
      if (appliedVoucherId) {
        await prismaProvider.voucher.update({
          where: { id: appliedVoucherId },
          data: { usedCount: { increment: 1 } }
        });
      }
      return order;
    });

    // Notify Kitchen
    try {
      const io = getIO();
      io.to('kitchen_room').emit('new_order', newOrder);
      console.log(`[Socket] Emitted new_order for Order #${newOrder.id}`);
    } catch (error) {
      console.error('[Socket] Failed to emit event:', error);
    }

    return newOrder;
  }

  async updateStatus(orderId: number, status: order_status) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Notify rooms
    const io = getIO();
    
    // Notify Kitchen (update UI)
    io.to('kitchen_room').emit('order_updated', order);
    
    // Notify POS (if completed)
    if (status === order_status.COMPLETED) {
        io.to('pos_room').emit('order_ready', order);
    }

    return order;
  }

  async cancelOrder(orderId: number) {
    // Check if order exists and is not already completed
    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existingOrder) throw new Error('Order not found');
    if (existingOrder.status === order_status.COMPLETED) throw new Error('Cannot cancel completed order');

    const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: order_status.CANCELLED }
    });

    const io = getIO();
    io.to('kitchen_room').emit('order_updated', order);
    return order;
  }

  async updatePaymentStatus(orderId: number, paymentMethod: string, paymentStatus: string) {
      const order = await prisma.order.update({
          where: { id: orderId },
          data: { paymentMethod, paymentStatus }
      });
      // Optionally notify if needed, but for now just DB update
      return order;
  }

  async getOrderById(id: number) {
      return prisma.order.findUnique({
          where: { id },
          include: {
              orderitem: {
                  include: {
                      product: true
                  }
              }
          }
      });
  }
}
