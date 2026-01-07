import prisma from '../prisma.js';

export class ProductService {
  
  // 1. Create a new product
  async createProduct(data: { name: string; description?: string; price: number; categoryId: number; imageUrl?: string }) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl ?? null,
      },
    });
  }

  // 2. Get all products
  async getAllProducts() {
    return await prisma.product.findMany({
        include: {
            category: true // Include category info
        }
    });
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
  async updateProduct(id: number, data: { name?: string; description?: string; price?: number; isAvailable?: boolean }) {
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
