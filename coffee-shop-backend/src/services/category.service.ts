import prisma from '../prisma.js';

export class CategoryService {
  async getAllCategories(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (search) {
      where.name = { contains: search }; // Default case-insensitive in some DBs, or specific syntax for Postgres/MySQL
    }

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      prisma.category.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createCategory(name: string) {
    return await prisma.category.create({
      data: { name },
    });
  }

  async updateCategory(id: number, name: string) {
    return await prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  async deleteCategory(id: number) {
    return await prisma.category.delete({
      where: { id },
    });
  }
}
