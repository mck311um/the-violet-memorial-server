import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRepository } from './user.repository';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepo: UserRepository,
  ) {}
  async createUser(newUser: CreateUserDto) {
    try {
      const existingUser = await this.userRepo.getUserByEmail(newUser.email);

      if (existingUser) {
        this.logger.warn(
          `Attempt to create user with existing email: ${newUser.email}`,
        );
        throw new ConflictException('Email already in use');
      }

      const existingOrg = await this.prisma.organization.findUnique({
        where: { id: newUser.organizationId },
      });

      if (!existingOrg) {
        this.logger.warn(
          `Attempt to create user with non-existent organization ID: ${newUser.organizationId}`,
        );
        throw new ConflictException('Organization does not exist');
      }

      const user = await this.prisma.user.create({
        data: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          organizationId: newUser.organizationId,
          role: newUser.role,
          profilePicture: newUser.profilePicture,
        },
      });

      const hashedPassword = await bcrypt.hash(newUser.password, 10);

      await this.prisma.userCredential.create({
        data: {
          userId: user.id,
          password: hashedPassword,
          email: newUser.email,
        },
      });
      this.logger.log(`User created with email: ${newUser.email}`);
      return user;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
