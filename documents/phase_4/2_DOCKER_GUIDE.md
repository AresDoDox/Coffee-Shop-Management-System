# 🐳 Docker Quick Reference (Hướng dẫn nhanh)

Tài liệu này tổng hợp các lệnh cần thiết để vận hành dự án với Docker Compose.

## 1. Khởi chạy ứng dụng (Start)

### Chạy bình thường (Khuyên dùng)
Chạy tất cả services dưới nền (background mode), không bị treo terminal.
```bash
docker-compose up -d
```

Chạy và Re-build (Khi sửa code/config)
Dùng khi bạn vừa thay đổi nội dung Dockerfile hoặc thêm thư viện mới, cần build lại image.
```bash
docker-compose up -d --build
```

Chạy và xem log trực tiếp (Debug)
Dùng khi cần debug lỗi ngay lập tức lúc khởi động. Nhấn Ctrl + C để dừng.
```bash
docker-compose up
```

---

## 2. Quản lý và Theo dõi (Monitor)
Xem Logs (Real-time)
Theo dõi log của tất cả services đang chạy.

```bash
docker-compose logs -f
```

Hoặc xem log của 1 service cụ thể:

```bash
docker-compose logs -f <tên_service>
# Ví dụ: docker-compose logs -f app
```

Kiểm tra trạng thái
Xem danh sách các container đang chạy, port nào đang mở.

```bash
docker-compose ps
```

---

## 3. Dừng ứng dụng (Stop)

Dừng tất cả services nhưng **giữ lại dữ liệu** (Volumes).
```bash
docker-compose stop
```

Dừng và **xóa container** (nhưng giữ lại Volume và Image).
```bash
docker-compose down
```

Dừng và **xóa sạch** (Container + Volume + Image).
**Cẩn thận:** Lệnh này sẽ mất hết dữ liệu trong database!
```bash
docker-compose down -v
```

---

## 4. Truy cập vào Container (Shell)

Để vào terminal của container (ví dụ để chạy lệnh artisan, npm, hoặc xem file):

```bash
docker-compose exec app bash
```

---

## 5. Quản lý Database

### Vào Database (MySQL)
```bash
docker-compose exec mysql mysql -u root -p
```
(Nhập mật khẩu root bạn đã cấu hình trong file .env)

### Reset Database (Xóa sạch và tạo lại)
**Cảnh báo:** Mất hết dữ liệu!
```bash
docker-compose down -v
docker-compose up -d --build
```

### Chạy Migration
```bash
docker-compose exec app php artisan migrate
```

### Seed dữ liệu mẫu
```bash
docker-compose exec app php artisan db:seed
```

---

## 6. Quản lý Queue (Hàng đợi)

### Chạy Queue Worker (Chế độ Production)
Chạy worker dưới nền, xử lý các tác vụ bất đồng bộ (gửi email, xử lý ảnh).
```bash
docker-compose exec app php artisan queue:work
```

### Chạy Queue với Supervisor (Khuyên dùng)
Supervisor sẽ tự động khởi động lại worker nếu bị lỗi.
```bash
docker-compose exec app supervisorctl reread
docker-compose exec app supervisorctl update
docker-compose exec app supervisorctl start all
```

### Kiểm tra Queue
```bash
docker-compose exec app php artisan queue:restart
```

---

## 7. Quản lý Redis

### Vào Redis CLI
```bash
docker-compose exec redis redis-cli
```

### Kiểm tra Redis
```bash
docker-compose exec redis redis-cli ping
```

---

## 8. Quản lý Nginx

###Xem Logs Nginx
```bash
docker-compose logs nginx
```

### Reload cấu hình Nginx
```bash
docker-compose exec nginx nginx -s reload
```

---

## 9. Quản lý Supervisor

###Xem Logs Supervisor
```bash
docker-compose logs supervisor
```

### Kiểm tra Supervisor
```bash
docker-compose exec supervisor supervisorctl status
```

---

## 10. Các lệnh hữu ích khác

### Build lại Image (Khi sửa Dockerfile)
```bash
docker-compose build
```

### Xóa Image cũ
```bash
docker image prune -a
```

### Xóa Volume cũ
```bash
docker volume prune
```

### Xóa Network cũ
```bash
docker network prune
```

### Dọn dẹp tất cả (Clean up)
```bash
docker system prune -a
```

---

## 11. Cấu hình môi trường (.env)

### Các biến quan trọng
- `APP_ENV`: `production` (Chế độ production)
- `APP_DEBUG`: `false` (Tắt debug)
- `APP_URL`: `https://yourdomain.com`
- `DB_CONNECTION`: `mysql`
- `DB_HOST`: `mysql` (Tên service trong docker-compose)
- `DB_PORT`: `3306`
- `DB_DATABASE`: `coffee_shop`
- `DB_USERNAME`: `root`
- `DB_PASSWORD`: `your_password`
- `CACHE_DRIVER`: `redis`
- `QUEUE_CONNECTION`: `redis`
- `REDIS_HOST`: `redis`
- `REDIS_PORT`: `6379`
- `REDIS_PASSWORD`: `null`
- `BROADCAST_DRIVER`: `log`
- `SESSION_DRIVER`: `redis`
- `FILESYSTEM_DISK`: `s3`
- `AWS_ACCESS_KEY_ID`: `your_access_key_id`
- `AWS_SECRET_ACCESS_KEY`: `your_secret_access_key`
- `AWS_DEFAULT_REGION`: `ap-southeast-1`
- `AWS_BUCKET`: `your_bucket_name`
- `AWS_URL`: `https://your-bucket-name.s3.ap-southeast-1.amazonaws.com`
- `AWS_ENDPOINT`: `https://s3.ap-southeast-1.amazonaws.com`
- `AWS_USE_PATH_STYLE_ENDPOINT`: `false`
- `AWS_USE_PATH_STYLE_ENDPOINT`: `false`
- `AWS_USE_PATH_STYLE_ENDPOINT`: `false`

### Tạo file .env
```bash
cp .env.example .env
```

### Cập nhật cấu hình
```bash
docker-compose exec app nano .env
```

---

## 12. Cấu hình Nginx

### Cấu hình Nginx
```bash
docker-compose exec nginx nano /etc/nginx/sites-available/default
```

### Reload cấu hình Nginx
```bash
docker-compose exec nginx nginx -s reload
```

---

## 13. Cấu hình Supervisor

### Cấu hình Supervisor
```bash
docker-compose exec supervisor nano /etc/supervisor/conf.d/laravel-worker.conf
```

### Reload cấu hình Supervisor
```bash
docker-compose exec supervisor supervisorctl reread
docker-compose exec supervisor supervisorctl update
docker-compose exec supervisor supervisorctl start all
```

---

## 14. Cấu hình Queue

### Cấu hình Queue
```bash
docker-compose exec app nano .env
```

### Cập nhật cấu hình
```bash
docker-compose exec app nano .env
```

---

## 15. Cấu hình Redis

### Cấu hình Redis
```bash
docker-compose exec redis nano /etc/redis/redis.conf
```

### Cập nhật cấu hình
```bash
docker-compose exec redis nano /etc/redis/redis.conf
```

---

## 16. Cấu hình Database

### Cấu hình Database
```bash
docker-compose exec mysql nano /etc/mysql/my.cnf
```

### Cập nhật cấu hình
```bash
docker-compose exec mysql nano /etc/mysql/my.cnf
```

---

## 17. Cấu hình AWS S3

### Cấu hình AWS S3
```bash
docker-compose exec app nano .env
```

### Cập nhật cấu hình
```bash
docker-compose exec app nano .env
```

---

## 18. Cấu hình Laravel

### Cấu hình Laravel
```bash
docker-compose exec app nano .env
```

### Cập nhật cấu hình
```bash
docker-compose exec app nano .env
```

---

## 19. Cấu hình PHP

### Cấu hình PHP
```bash
docker-compose exec app nano /etc/php/8.2/fpm/php.ini
```

### Cập nhật cấu hình
```bash
docker-compose exec app nano /etc/php/8.2/fpm/php.ini
```

---

## 20. Cấu hình Docker

### Cấu hình Docker
```bash
docker-compose exec app nano /etc/docker/daemon.json
```

### Cập nhật cấu hình
```bash
docker-compose exec app nano /etc/docker/daemon.json
```

---

## 21. Cấu hình Docker Compose

### Cấu hình Docker Compose
```bash
docker-compose exec app nano docker-compose.yml
```

### Cập nhật cấu hình
```bash
docker-compose exec app nano docker-compose.yml
```

---

## 22. Cấu hình Dockerfile

### Cấu hình Dockerfile
```bash
docker-compose exec app nano Dockerfile
```

### Cập nhật cấu hình
```bash
docker-compose exec app nano Dockerfile
```
