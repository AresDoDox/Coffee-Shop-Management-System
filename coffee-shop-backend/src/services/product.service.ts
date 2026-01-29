import prisma from '../prisma.js';

export class ProductService {
  
  // 1. Create a new product
  async createProduct(data: { name: string; description?: string; price: number; categoryId: number; imageUrl?: string; isAvailable?: boolean }) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl ?? null,
        isAvailable: data.isAvailable ?? true,
      },
    });
  }

  // 2. Get all products
  async getAllProducts(params: { page?: number; limit?: number; search?: string; categoryId?: number } = {}) {
    const { page = 1, limit = 10, search, categoryId } = params;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (search) {
        where.OR = [
            { name: { contains: search } }, // Check DB case-sensitivity support
            { description: { contains: search } }
        ];
    }
    
    if (categoryId) {
        where.categoryId = categoryId;
    }

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
            category: true // Include category info
        },
        orderBy: { id: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
  }

  // 3. Get product by ID
  async getProductById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
  }

  // 4. Update product
  async updateProduct(id: number, data: { name?: string; description?: string; price?: number; isAvailable?: boolean; categoryId?: number; imageUrl?: string }) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  // 5. Delete product
  async deleteProduct(id: number) {
    return await prisma.product.delete({
      where: { id },
    });
  }
}
