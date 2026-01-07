import prisma from '../prisma.js';
import { order_status } from '@prisma/client';

interface OrderItemInput {
  productId: number;
  quantity: number;
}

export class OrderService {
  
  // Create Order with Transaction (Nested Writes)
  async createOrder(userId: number, items: OrderItemInput[]) {
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

    // 3. Tạo Order và OrderItem cùng lúc (Transaction)
    // Prisma gọi đây là "Nested Write" - Ghi lồng nhau
    const newOrder = await prisma.order.create({
      data: {
        userId: userId,
        totalAmount: totalAmount,
        status: order_status.PENDING,
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

    return newOrder;
  }
}
