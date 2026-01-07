import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

console.log('Checking DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not Loaded');

export default prisma;
