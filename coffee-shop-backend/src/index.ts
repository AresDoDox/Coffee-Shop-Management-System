import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import dotenv from 'dotenv';




dotenv.config();

const app = express();

let connectionString = process.env.DATABASE_URL!;
if (connectionString.startsWith('mysql://')) {
  connectionString = connectionString.replace('mysql://', 'mariadb://');
}
// Fix empty password issue causing parse error (root:@ => root@)
connectionString = connectionString.replace(':@', '@');

const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Coffee Shop Backend is running!' });
});

// Test database connection
async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database successfully');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
}

main().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server ready at: http://localhost:${port}`);
  });
});
