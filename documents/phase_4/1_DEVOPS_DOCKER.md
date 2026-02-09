# Phase 5: DevOps & Containerization (Docker)

**Trạng thái:** ✅ Đã hoàn thành (Final Phase)
**Công nghệ:** `Docker`, `Docker Compose`, `Nginx`, `Node.js Alpine`
**Mục tiêu:** Đóng gói toàn bộ ứng dụng (Fullstack) vào các Container độc lập để đảm bảo "Chạy đúng trên mọi môi trường" (Write once, run anywhere).

---

## 1. Kiến trúc Triển khai (Deployment Architecture)

Thay vì chạy thủ công từng terminal (`npm start`), chúng ta sử dụng Docker Compose để điều phối 3 dịch vụ chạy song song trong một mạng ảo (Virtual Network).

[Image of docker compose architecture diagram]

### Các thành phần (Services):

1.  **Database (PostgreSQL):** Chạy trên Image chuẩn `postgres:15`. Dữ liệu được lưu trữ bền vững qua `Volume`.
2.  **Backend (API):** Chạy trên môi trường `node:18-alpine` (siêu nhẹ). Kết nối với DB qua mạng nội bộ Docker.
3.  **Frontend (Client):** Sử dụng chiến lược **Multi-stage Build**:
    - _Stage 1:_ Build React ra file tĩnh (HTML/CSS/JS).
    - _Stage 2:_ Dùng **Nginx** để phục vụ các file tĩnh này (Production Grade).

---

## 2. Chi tiết Cấu hình (Configuration)

### A. Backend (`coffee-shop-backend/Dockerfile`)

Lưu ý quan trọng: Phải chạy `prisma generate` để tạo Prisma Client tương thích với hệ điều hành Linux trong Docker.

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Tạo Prisma Client cho môi trường Linux
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

### B. Frontend (coffee-shop-frontend/Dockerfile)

Sử dụng Nginx làm Web Server thay vì Node.js để tối ưu hiệu năng và sửa lỗi Routing của SPA (Single Page App).

```dockerfile
# Stage 1: Build
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Cấu hình Nginx (nginx.conf):

```Nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html; # Fix lỗi 404 khi F5
    }
}
```

### C. Orchestration (docker-compose.yml)

File nhạc trưởng điều khiển toàn bộ hệ thống.

- Networking: Backend kết nối DB qua hostname db (không dùng localhost).

- Volumes: pgdata giúp dữ liệu không bị mất khi restart container.

- Port Mapping:
  - Frontend: Máy thật 8080 -> Container 80.

  - Backend: Máy thật 3000 -> Container 3000.

**Example:** Tạo file docker-compose.yml ở thư mục gốc (nơi chứa cả folder frontend và backend).

```YAML
version: '3.8'

services:
  # 1. Database PostgreSQL
  db:
    image: postgres:15
    container_name: coffee_db_container
    environment:
      POSTGRES_USER: user123
      POSTGRES_PASSWORD: password123
      POSTGRES_DB: coffee_shop_db
    volumes:
      - pgdata:/var/lib/postgresql/data # Để dữ liệu không mất khi tắt Docker
    ports:
      - "5432:5432"

  # 2. Backend API
  backend:
    build: ./coffee-shop-backend
    container_name: coffee_backend_container
    ports:
      - "3000:3000"
    environment:
      # LƯU Ý: host không phải là localhost, mà là tên service 'db'
      DATABASE_URL: "postgresql://user123:password123@db:5432/coffee_shop_db?schema=public"
      PORT: 3000
      # Copy các biến môi trường khác từ .env của bạn vào đây
      JWT_SECRET: "bi_mat_cua_ban"
      CLOUDINARY_CLOUD_NAME: "..."
      CLOUDINARY_API_KEY: "..."
      CLOUDINARY_API_SECRET: "..."
    depends_on:
      - db # Chờ db chạy xong mới chạy backend

  # 3. Frontend React
  frontend:
    build: ./coffee-shop-frontend
    container_name: coffee_frontend_container
    ports:
      - "8080:80" # Map cổng 80 của container ra cổng 8080 máy thật
    depends_on:
      - backend

volumes:
  pgdata:
```

---

## 3. Hướng dẫn Vận hành (Operations Guide)

Bước 1: Khởi động hệ thống
Tại thư mục gốc của dự án:

```bash
docker-compose up --build
```

Lần đầu chạy sẽ mất 5-10 phút để tải Image và Build.

Bước 2: Đồng bộ Database (Quan trọng)
Database trong Docker là mới tinh (trống trơn). Cần chạy lệnh migrate xuyên qua container:

```bash
# Cú pháp: docker exec -it <tên_container_backend> <lệnh>
docker exec -it coffee_backend_container npx prisma migrate deploy
```

(Nếu muốn có dữ liệu mẫu, chạy thêm npx prisma db seed nếu đã cấu hình seed).

Bước 3: Kiểm tra

- Frontend: Truy cập http://localhost:8080.

- Backend: http://localhost:3000.

- Database: Kết nối qua localhost:5432 (User/Pass như trong file yaml).

---

## 4. Các lỗi thường gặp (Troubleshooting)

1. Lỗi kết nối DB (P1001):
   - Kiểm tra DATABASE_URL trong docker-compose.yml. Nó phải là postgresql://user:pass@db:5432/... (chữ db là tên service, không phải localhost).

2. Lỗi Frontend 404 khi reload:
   - Do thiếu file nginx.conf hoặc cấu hình try_files sai.

3. Lỗi Prisma Client:
   - Do thiếu lệnh npx prisma generate trong Dockerfile backend.
