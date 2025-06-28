import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { sign, SignOptions } from 'jsonwebtoken';
import { LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '../types';
import { UserRepository } from '../repository/user/user.repository';
import { Logger } from '../utils/logger.util';
const prisma = new PrismaClient();

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(prisma);
  }

  async register(dto: RegisterRequest): Promise<UserResponse> {
    try {
      Logger.info('User registration process started', {
        action: 'auth-register',
        email: dto.email,
      });

      const existingUser = await this.userRepository.findUserByEmail(dto.email);
      if (existingUser) {
        Logger.warn('Registration failed - email already exists', {
          action: 'auth-register',
          email: dto.email,
        });
        throw new Error('Email already exists');
      }

      const hashed = await bcrypt.hash(dto.password, 10);
      const user = await this.userRepository.createUser({
        email: dto.email,
        password: hashed,
      });

      Logger.info('User registration completed successfully', {
        action: 'auth-register',
        email: dto.email,
        userId: user.id,
      });

      return { id: user.id, email: user.email };
    } catch (error: any) {
      Logger.error(
        'User registration failed',
        {
          action: 'auth-register',
          email: dto.email,
          errorMessage: error.message,
        },
        error
      );
      throw error;
    }
  }

  async login(dto: LoginRequest): Promise<AuthResponse> {
    try {
      Logger.info('User login process started', {
        action: 'auth-login',
        email: dto.email,
      });

      const user = await this.userRepository.findUserByEmail(dto.email);
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        Logger.warn('Login failed - invalid credentials', {
          action: 'auth-login',
          email: dto.email,
        });
        return null;
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        Logger.error('JWT_SECRET is not defined in environment', {
          action: 'auth-login',
          email: dto.email,
        });
        throw new Error('JWT_SECRET não está definido no .env');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
      };

      const token = sign(payload, jwtSecret, {
        expiresIn: '24h',
      });

      Logger.info('User login completed successfully', {
        action: 'auth-login',
        email: dto.email,
        userId: user.id,
      });

      return {
        access_token: token,
      };
    } catch (error: any) {
      Logger.error(
        'User login failed',
        {
          action: 'auth-login',
          email: dto.email,
          errorMessage: error.message,
        },
        error
      );
      throw error;
    }
  }
}
