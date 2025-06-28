import { PrismaClient } from '@prisma/client';
import { UserEntity } from './user.entity';
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async createUser(data: { email: string; password: string }): Promise<UserEntity> {
    return this.prisma.user.create({ data });
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
