import prisma from '../prisma.js';
import { getIO } from '../socket.js';

export class PaymentService {
  // 1. Generate VietQR
  async generateQRCode(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<INFO>
    // Example: MB Bank (970422), Account: 0352526378, Template: compact
    const BANK_ID = process.env.BANK_ID || 'MB';
    const ACCOUNT_NO = process.env.BANK_ACCOUNT_NO || '0352526378';
    const TEMPLATE = process.env.BANK_TEMPLATE || 'compact';
    const amount = Number(order.totalAmount);
    const addInfo = `Thanh toan don hang ${orderId}`;

    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}`;

    return {
      orderId,
      amount,
      qrUrl,
    };
  }

  // 2. Process Webhook (Simulated Payment Success)
  async processWebhook(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.paymentStatus === 'PAID') {
      return { message: 'Order already paid' };
    }

    // Update Order Status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
      },
    });

    // Real-time Notification
    const io = getIO();
    io.emit(`payment_update_${orderId}`, {
      status: 'PAID',
      orderId,
    });
    
    // Also emit to dashboard/kitchen if needed
    io.emit('order_updated', updatedOrder);

    return updatedOrder;
  }
}
