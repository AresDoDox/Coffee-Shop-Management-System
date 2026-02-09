## 🚀 How to Run

### 1. Start the application
Build and start the containers in detached mode:
```bash
docker-compose up -d --build
```

This will start:

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- MySQL Database: localhost:3307 (Mapped from 3306 to avoid local conflicts)

### 2. Run Migrations (First Time Only)
The database is persistent in a Docker volume. Run this command to apply the schema:

```bash
docker exec -it coffee_backend_container npx prisma migrate deploy
```

### 3. Seed Database (First Time Only)
To populate initial data (admin user, products, etc.):

```bash
docker exec -it coffee_backend_container npx prisma db seed
```

### 4. Stop the application
To stop the containers:

```bash
docker-compose down
```

### Access Points

Service | URL | Container Name
--- | --- | ---
Frontend | http://localhost:8080 | coffee_frontend_container
Backend API | http://localhost:3000 | coffee_backend_container
Database | localhost:3307 | coffee_db_container

### Default Credentials

Email: admin@coffee.com
Password: 123456

