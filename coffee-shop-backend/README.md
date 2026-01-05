# Coffee Shop Backend

Backend service for the Coffee Shop Management System, built with Node.js, Express, TypeScript, and Prisma.

## Prerequisites

- **Node.js**: v20 or higher recommended.
- **Database**: MySQL (or MariaDB) local instance.

## Installation

1.  Clone the repository and navigate to the backend directory:

    ```bash
    cd coffee-shop-backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the root directory (you can copy from an example if available, otherwise use the following template):

    ```env
    PORT=3000
    # Update with your database credentials
    DATABASE_URL="mysql://root:password@localhost:3306/coffee_shop_db"
    ```

    > **Note**: For empty passwords, you can use `mysql://root:@localhost:3306/coffee_shop_db`. The application automatically sanitizes the connection string for the MariaDB driver.

## Database Setup

This project uses **Prisma v7** with `@prisma/adapter-mariadb` for MySQL connections.

1.  Run migrations to set up the database schema:

    ```bash
    npx prisma migrate dev --name init
    ```

## Running the Application

### Development

Run the server in watch mode:

```bash
npm run dev
```

### Production

1.  Build the TypeScript code:

    ```bash
    npm run build
    ```

2.  Start the production server:

    ```bash
    npm start
    ```

## Development Tools

### Linting & Formatting

This project uses **ESLint** (v9) and **Prettier**.

-   Check for linting errors:

    ```bash
    npm run lint
    ```

-   Auto-fix linting errors:

    ```bash
    npm run lint:fix
    ```

-   Format code with Prettier:

    ```bash
    npm run format
    ```

## Project Structure

-   `src/`: Source code.
-   `prisma/`: Database schema and migrations.
-   `dist/`: Compiled JavaScript output.
-   `prisma.config.ts`: Prisma CLI configuration.
