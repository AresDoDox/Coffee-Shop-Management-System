import prisma from '../prisma.js';

export class StatsService {
  async getDashboardStats() {
    // 1. Overview Stats (Revenue & Total Orders)
    const overview = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    // 2. Top Selling Products
    const topSellingGrouped = await prisma.orderitem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    // Fetch product details for the top selling items
    const topProducts = await prisma.product.findMany({
      where: {
        id: { in: topSellingGrouped.map((item) => item.productId) },
      },
    });

    // Map details back to the grouped data
    const topSellingParams = topSellingGrouped.map((item) => {
      const product = topProducts.find((p) => p.id === item.productId);
      return {
        name: product?.name || 'Unknown',
        totalSold: item._sum.quantity || 0,
        revenue: (item._sum.quantity || 0) * Number(product?.price || 0),
      };
    });

    // 3. Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        orderitem: { include: { product: true } }
      }
    });

    return {
      revenue: overview._sum.totalAmount || 0,
      totalOrders: overview._count.id || 0,
      topSelling: topSellingParams,
      recentOrders,
    };
  }
}
