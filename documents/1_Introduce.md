# Coffee Shop Management System (Fullstack Training Project)

## 1. Giới thiệu
Dự án xây dựng hệ thống quản lý quán cà phê từ A-Z.
**Mục tiêu:** Chuyển đổi kỹ năng từ Frontend Developer sang Fullstack Developer (Node.js + MySQL).

## 2. Tech Stack (Công nghệ sử dụng)

* **Frontend:** React (hoặc Next.js), TailwindCSS, Axios/TanStack Query.
* **Backend:** Node.js, Express Framework.
* **Database:** MySQL.
* **ORM:** Prisma (Công cụ giao tiếp giữa Node.js và MySQL).
* **Authentication:** JSON Web Token (JWT), Bcrypt.

## 3. Các tính năng chính (Modules)

### A. Xác thực & Phân quyền (Auth)
* Đăng nhập (Admin/Staff).
* Phân quyền:
    * **Admin:** Quản lý toàn bộ (Menu, Nhân viên, Báo cáo).
    * **Staff:** Chỉ truy cập POS (Bán hàng) và xem Menu.

### B. Quản lý Nhân viên (Admin)
* Xem danh sách nhân viên.
* Tạo tài khoản mới cho nhân viên.
* Cập nhật/Khóa tài khoản.

### C. Quản lý Sản phẩm (Menu)
* CRUD (Thêm, Xem, Sửa, Xóa) danh mục và sản phẩm.
* Quản lý giá và trạng thái (Còn hàng/Hết hàng).

### D. Bán hàng (POS - Point of Sale)
* Giao diện chọn món, thêm vào giỏ hàng.
* Xử lý đơn hàng: Tính tổng tiền, ghi chú (ít đường, nhiều đá).
* Thanh toán và in hóa đơn (logic).

### E. Báo cáo (Dashboard)
* Thống kê doanh thu theo ngày/tháng.
* Lịch sử đơn hàng.

---

## 4. Thiết kế Cơ sở dữ liệu (Database Schema)

Sử dụng **Prisma ORM** để định nghĩa bảng.

```prisma
// File: prisma/schema.prisma

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(STAFF) // Enum: ADMIN, STAFF
  createdAt DateTime @default(now())
  orders    Order[]
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String
  products Product[]
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Decimal  @db.Decimal(10, 2)
  isAvailable Boolean  @default(true)
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
}

model Order {
  id          Int         @id @default(autoincrement())
  createdAt   DateTime    @default(now())
  totalAmount Decimal     @db.Decimal(10, 2)
  status      OrderStatus @default(PENDING) // Enum: PENDING, COMPLETED, CANCELLED
  userId      Int
  user        User        @relation(fields: [userId], references: [id])
  items       OrderItem[]
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  quantity  Int
  price     Decimal @db.Decimal(10, 2) // Lưu giá tại thời điểm bán
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id])
  productId Int
  product   Product @relation(fields: [productId], references: [id])
}

enum Role {
  ADMIN
  STAFF
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}
```