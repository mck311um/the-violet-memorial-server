import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/browser';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.getUserSelectOptions(),
    });
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: this.getUserSelectOptions(),
    });
  }

  private getUserSelectOptions(): Prisma.UserSelect {
    return {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      credential: true,
      passwordHistory: true,
      otps: true,
      sessions: true,
    };
  }
}
