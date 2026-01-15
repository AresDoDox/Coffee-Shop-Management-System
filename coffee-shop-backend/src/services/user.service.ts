import errors from '../constants/errors.json' with { type: "json" };
import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
  // Register new user
  async register(email: string, password: string, name?: string) {
    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error(errors.USER.ALREADY_EXISTS);
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null,
        role: 'STAFF', // Default role
      },
    });

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Login
  async login(email: string, password: string) {
    // 1. Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error(errors.USER.INVALID_CREDENTIALS);
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(errors.USER.INVALID_CREDENTIALS);
    }

    // 3. Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
