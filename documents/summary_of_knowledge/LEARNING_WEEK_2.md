# Tuần 2: Kiến trúc Backend (3-Layer Architecture)

**Trạng thái:** ✅ Đã hoàn thành
**Mục tiêu:** Tái cấu trúc dự án từ "Spaghetti Code" (viết hết trong 1 file) sang mô hình phân tầng chuyên nghiệp, dễ bảo trì.

---

## 1. Tại sao cần phân tầng?

Việc viết tất cả logic vào file `index.ts` giống như việc viết toàn bộ logic của Frontend vào file `App.js`. Nó dẫn đến code khó đọc, khó sửa và khó test.

Chúng ta sử dụng mô hình **3 Tầng (Controller - Service - Data Access)** để tách biệt trách nhiệm (**Separation of Concerns**).

---

## 2. Mô hình "Nhà hàng" (The Restaurant Metaphor)

Để dễ hình dung, hãy tưởng tượng Backend server là một nhà hàng:

| Tầng (Layer) | Vai trò trong Code | Hình ảnh ẩn dụ | Nhiệm vụ chính |
| :--- | :--- | :--- | :--- |
| **Routes** | `routes/*.ts` | **Menu & Lễ tân** | Điều hướng khách (Request) đến đúng bàn phục vụ. |
| **Controller** | `controllers/*.ts` | **Bồi bàn (Waiter)** | Nhận yêu cầu, kiểm tra input, sai bồi bàn gọi Bếp, nhận món trả cho khách. **Không nấu ăn!** |
| **Service** | `services/*.ts` | **Đầu bếp (Chef)** | Thực hiện logic nghiệp vụ (Tính toán, xử lý). **Không quan tâm khách là ai.** |
| **Prisma/DB** | `PrismaClient` | **Kho nguyên liệu** | Nơi lưu trữ dữ liệu gốc. |

---

## 3. Luồng dữ liệu (Data Flow)

Dữ liệu trong ứng dụng sẽ chảy theo một chiều khép kín:

```mermaid
graph LR
    Client((Frontend)) -- 1. Request (GET /products) --> Router[Routes]
    Router -- 2. Forward --> Controller[Controller]
    Controller -- 3. Call Logic --> Service[Service]
    Service -- 4. Query DB --> Prisma[(Database)]
    
    Prisma -- 5. Return Data --> Service
    Service -- 6. Return Data --> Controller
    Controller -- 7. Response JSON --> Client
```
