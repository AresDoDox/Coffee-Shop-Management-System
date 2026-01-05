import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Prisma Client with MariaDB Adapter
let connectionString = process.env.DATABASE_URL!;
if (connectionString.startsWith('mysql://')) {
  connectionString = connectionString.replace('mysql://', 'mariadb://');
}
connectionString = connectionString.replace(':@', '@');

const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Dọn dẹp dữ liệu cũ (Xóa theo thứ tự để tránh lỗi khóa ngoại)
  // Xóa chi tiết đơn hàng và đơn hàng trước, sau đó đến sản phẩm, danh mục và user
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Đã xóa dữ liệu cũ.');

  // 2. Tạo Danh mục (Categories)
  const cafeCategory = await prisma.category.create({
    data: { name: 'Cà phê' },
  });
  
  const teaCategory = await prisma.category.create({
    data: { name: 'Trà trái cây' },
  });

  const cakeCategory = await prisma.category.create({
    data: { name: 'Bánh ngọt' },
  });

  // 3. Tạo Sản phẩm (Products)
  await prisma.product.createMany({
    data: [
      // Cà phê
      {
        name: 'Cà phê Đen đá',
        price: 25000,
        categoryId: cafeCategory.id,
        imageUrl: 'https://placehold.co/100?text=Cafe+Den', // Ảnh giả lập
        isAvailable: true,
      },
      {
        name: 'Bạc Xỉu',
        price: 29000,
        categoryId: cafeCategory.id,
        imageUrl: 'https://placehold.co/100?text=Bac+Xiu',
        isAvailable: true,
      },
      // Trà
      {
        name: 'Trà Đào Cam Sả',
        price: 35000,
        categoryId: teaCategory.id,
        imageUrl: 'https://placehold.co/100?text=Tra+Dao',
        isAvailable: true,
      },
      {
        name: 'Trà Lài Hạt Sen',
        price: 39000,
        categoryId: teaCategory.id,
        imageUrl: 'https://placehold.co/100?text=Tra+Lai',
        isAvailable: true,
      },
      // Bánh
      {
        name: 'Bánh Croissant',
        price: 45000,
        categoryId: cakeCategory.id,
        imageUrl: 'https://placehold.co/100?text=Banh',
        isAvailable: true,
      }
    ],
  });

  console.log('✅ Đã tạo Menu sản phẩm.');

  // 4. Tạo Users (Nhân viên & Admin)
  const password = await bcrypt.hash('123456', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@coffee.com',
        password,
        name: 'Quản Lý Cửa Hàng',
        role: 'ADMIN',
      },
      {
        email: 'staff1@coffee.com',
        password,
        name: 'Nguyễn Văn A',
        role: 'STAFF',
      },
      {
        email: 'staff2@coffee.com',
        password, 
        name: 'Trần Thị B',
        role: 'STAFF',
      },
    ],
  });

  console.log('✅ Đã tạo Users.');
  console.log('🚀 Seeding hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
