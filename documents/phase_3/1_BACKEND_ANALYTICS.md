# Phase 3 (Phần 1): Xây dựng API Thống kê (Backend Analytics)

**Trạng thái:** ✅ Đã hoàn thành Backend API
**Công nghệ:** `Prisma Aggregations`, `Express`, `Node.js`
**Mục tiêu:** Cung cấp dữ liệu tổng hợp (Doanh thu, Top sản phẩm) cho Dashboard thông qua các hàm tính toán của Database.

---

## 1. Khái niệm & Kỹ thuật



Để tính toán các con số lớn mà không làm sập Server, chúng ta **không** tải toàn bộ đơn hàng về rồi dùng vòng lặp `for` để cộng. Chúng ta sử dụng các hàm **Aggregation (Tổng hợp)** ngay tại Database.

* **`_sum`:** Tính tổng doanh thu (`totalAmount`).
* **`_count`:** Đếm tổng số đơn hàng (`id`).
* **`groupBy`:** Gom nhóm các đơn hàng theo sản phẩm để tìm ra món bán chạy nhất.

---

## 2. Chi tiết Triển khai (Implementation)

### A. Logic Service (`src/services/stats.service.ts`)
Sử dụng Prisma Client để thực hiện các câu truy vấn phức tạp.

```typescript
// 1. Lấy tổng quan (Revenue & Total Orders)
const overview = await prisma.order.aggregate({
  _sum: { totalAmount: true },
  _count: { id: true }
});

// 2. Lấy Top Sản phẩm (Group By ProductID)
const topSelling = await prisma.orderItem.groupBy({
  by: ['productId'],
  _sum: { quantity: true },
  orderBy: { _sum: { quantity: 'desc' } },
  take: 5
});
```

### B. Controller & Route
- Controller: src/controllers/stats.controller.ts
- Route: src/routes/stats.routes.ts
- Security: Yêu cầu Middleware authenticateToken (Chỉ Admin/Staff mới xem được).

---

## 3. Tài liệu API (API Documentation)
Frontend Developer (hoặc chính bạn ở bước sau) sẽ cần thông tin này để gọi API.

Endpoint: GET /stats/dashboard Auth: Bearer Token

Response Body (JSON Example):
```json
{
  "revenue": 5500000,          // Tổng doanh thu (VNĐ)
  "totalOrders": 120,          // Tổng số đơn
  "topSelling": [              // Mảng top 5 món bán chạy
    {
      "name": "Cà phê sữa đá",
      "totalSold": 45,
      "revenue": 1125000
    },
    {
      "name": "Bạc xỉu",
      "totalSold": 30,
      "revenue": 900000
    }
  ],
  "recentOrders": [...]        // 5 đơn hàng mới nhất
}
```

---

## 4. Checklist

- [x] Database: Prisma đã thực hiện được lệnh aggregate và groupBy.
- [x] Logic: Tính đúng tổng doanh thu (đã đối chiếu với DB).
- [x] Security: API bị chặn nếu không có Token.
- [x] Performance: Tốc độ phản hồi nhanh (do DB tính toán, không phải JS tính).