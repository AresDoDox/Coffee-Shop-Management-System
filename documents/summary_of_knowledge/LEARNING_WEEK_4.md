# Tuần 4: Xây dựng Frontend & Tích hợp hệ thống

**Thời gian hoàn thành:** Tuần 4
**Trạng thái:** ✅ Đã hoàn thành setup cơ bản
**Mục tiêu:** Khởi tạo dự án React, cấu hình TailwindCSS và kết nối thành công với Backend API.

---

## 1. Vấn đề cốt lõi: CORS (Cross-Origin Resource Sharing)



Trước khi Frontend và Backend nói chuyện được với nhau, ta phải xử lý bảo mật trình duyệt.

* **Vấn đề:** Trình duyệt chặn request từ `localhost:5173` (Frontend) sang `localhost:3000` (Backend) vì khác cổng (Port).
* **Giải pháp:** Cấu hình Backend cho phép Frontend truy cập.

**Cấu hình tại Backend (`src/index.ts`):**
```typescript
import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:5173', // Chỉ cho phép domain này
  credentials: true // Cho phép gửi kèm cookie/token
}));
```

---

## 2. Tech Stack Frontend

- Framework: React (Vite)
- Language: TypeScript
- Styling: TailwindCSS
- HTTP Client: Axios
- Routing: React Router DOM

---

## 3. Kiến trúc thư mục Frontend

```bash
src/
├── components/   # Các UI nhỏ (Button, Input, Card)
├── pages/        # Các màn hình chính (Login, Home, POS)
├── services/     # Tầng giao tiếp API (Tương đương Service bên BE)
│   ├── api.ts            # Cấu hình Axios gốc
│   └── product.service.ts # Các hàm gọi API sản phẩm
├── App.tsx       # Routing & Layout
└── main.tsx      # Entry point
```

---

## 4. Tầng mạng (Networking Layer) - Axios Instance

Thay vì dùng fetch hoặc axios trần ở khắp nơi, ta tạo một Instance duy nhất.

Lợi ích:

1. DRY (Don't Repeat Yourself): Không cần gõ lại http://localhost:3000 nhiều lần.
2. Automation: Tự động đính kèm Token vào mọi request thông qua Interceptors.

Code mẫu (src/services/api.ts):

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor: Tự động kẹp Token vào Header trước khi gửi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 5. Luồng dữ liệu (Integration Flow)

```mermaid
sequenceDiagram
    participant ReactUI as React Component
    participant Service as Frontend Service
    participant Axios as Axios Instance
    participant Backend as Node.js Server
    participant DB as MySQL

    ReactUI->>Service: 1. useEffect gọi getProducts()
    Service->>Axios: 2. Gọi API GET /products
    Axios->>Axios: 3. Interceptor (Kẹp Token nếu có)
    Axios->>Backend: 4. Gửi HTTP Request
    
    Backend->>DB: 5. Query Database
    DB-->>Backend: 6. Trả về Data
    Backend-->>Axios: 7. Trả về JSON Response
    
    Axios-->>Service: 8. Trả về response.data
    Service-->>ReactUI: 9. Data sạch
    ReactUI->>ReactUI: 10. setState(products) -> Render UI
```

---

## 6. Checklist hoàn thành

- [x] Backend CORS: Đã mở cổng cho Frontend kết nối.

- [x] Project Setup: Vite + React + TS + TailwindCSS.

- [x] Architecture: Đã tạo cấu trúc folder services, pages, components.

- [x] API Client: Đã cấu hình Axios Instance và Interceptor.

- [x] Integration Test: Đã hiển thị được danh sách sản phẩm từ Database lên màn hình.

---

# Tuần 4 (Phần 2): Tích hợp Đăng nhập & Lưu trữ Token

**Thời gian hoàn thành:** Tuần 4
**Trạng thái:** ✅ Đã hoàn thành chức năng Login
**Mục tiêu:** Xây dựng giao diện đăng nhập, gọi API xác thực và lưu trữ JWT Token vào LocalStorage.

---

## 1. Luồng xử lý Đăng nhập (Login Flow)

Cơ chế xác thực phía Frontend hoạt động theo nguyên lý "Chìa khóa và Cái túi".

```mermaid
sequenceDiagram
    participant User
    participant LoginPage as Login Form
    participant AuthService
    participant Backend
    participant LocalStorage as Browser Storage

    User->>LoginPage: 1. Nhập Email & Pass
    LoginPage->>AuthService: 2. Gọi hàm loginAPI()
    AuthService->>Backend: 3. POST /auth/login
    
    alt Sai thông tin
        Backend-->>AuthService: Lỗi 401
        AuthService-->>LoginPage: Báo lỗi "Sai mật khẩu"
        LoginPage-->>User: Hiển thị thông báo đỏ
    else Đúng thông tin
        Backend-->>AuthService: Trả về { user, token }
        AuthService-->>LoginPage: Trả data
        
        Note over LoginPage, LocalStorage: QUAN TRỌNG NHẤT
        LoginPage->>LocalStorage: 4. Lưu Token ("Chìa khóa")
        LoginPage->>LocalStorage: 5. Lưu User Info
        
        LoginPage->>User: 6. Chuyển hướng sang trang Menu (/menu)
    end
```

---

## 2. Các thư viện sử dụng

- react-hook-form: Quản lý form (Validate input, handle submit) mà không cần tạo quá nhiều state.

- react-router-dom: Điều hướng trang (useNavigate).

- axios: Đã cấu hình Interceptor ở phần trước (Tự động lấy token từ LocalStorage gửi đi).

---

# Tuần 4 (Phần 3): Bảo vệ Route (Private Route)

**Thời gian hoàn thành:** Tuần 4
**Trạng thái:** ✅ Đã hoàn thành bảo mật Frontend
**Mục tiêu:** Chặn người dùng chưa đăng nhập truy cập trực tiếp vào các trang nội bộ bằng cách gõ URL.

---

## 1. Khái niệm Private Route
Trong React Router v6, **Private Route** hoạt động như một lớp vỏ bọc (Wrapper Component). Nó kiểm tra điều kiện xác thực (Token) trước khi quyết định có hiển thị nội dung bên trong hay không.

### Luồng xử lý (Logic Flow)

```mermaid
graph TD
    User[Người dùng] --> URL[Truy cập /menu]
    URL --> PrivateRoute{Kiểm tra LocalStorage}
    
    PrivateRoute -- Có Token --> Outlet[< Outlet / >]
    Outlet --> Page[Hiển thị trang Menu]
    
    PrivateRoute -- Không có Token --> Navigate[< Navigate toLogin / >]
    Navigate --> Login[Chuyển về trang Login]
```

---

# Tổng kết Tuần 4:

- [x] Core: Setup React + Tailwind + Axios Instance.

- [x] API: Kết nối Backend, xử lý CORS.

- [x] Auth: Đăng nhập, Lưu trữ Token, Logout.

- [x] Security: Bảo vệ các trang nội bộ (Private Route). 
