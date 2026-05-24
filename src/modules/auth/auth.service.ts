import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthDataDto } from './dto/auth-data.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRepository } from '../user/user.repository';
import bcrypt from 'bcrypt';
import { AuditLogService } from './services/audit-log.service';
import { SessionService } from './services/session.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
    private readonly sessionService: SessionService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async validateUser(data: AuthDataDto) {
    try {
      if (!data.username || !data.password) {
        this.logger.warn('Login failed: Missing username or password.');
        throw new UnauthorizedException('Username and password are required');
      }

      const user = await this.userRepo.getUserByEmail(data.username);

      if (!user) {
        this.logger.warn(`Login failed: User ${data.username} not found.`);
        throw new UnauthorizedException('Invalid username or password');
      }

      if (!user.credential) {
        this.logger.warn(
          `Login failed: User ${data.username} does not have a credential set.`,
        );
        throw new UnauthorizedException('Invalid username or password');
      }

      const passwordValid = await bcrypt.compare(
        data.password,
        user.credential.password,
      );

      if (!passwordValid) {
        this.auditLogService.logEvent({
          userId: user.id,
          action: 'LOGIN_FAILED',
          ip: data.ip,
          userAgent: data.userAgent,
          meta: data.meta,
        });

        this.logger.warn(
          `Login failed: Invalid password for user ${data.username}.`,
        );
        throw new UnauthorizedException('Invalid username or password');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error) {
      this.logger.error('Error during user validation', error);
      throw error;
    }
  }

  async login(data: AuthDataDto) {
    try {
      if (!data.userId) {
        this.logger.warn('Login failed: Missing userId in AuthDataDto.');
        throw new UnauthorizedException('User ID is required for login');
      }

      const user = await this.userRepo.getUserById(data.userId);

      if (!user) {
        this.logger.warn(
          `Login failed: User with ID ${data.userId} not found.`,
        );
        throw new UnauthorizedException('User not found');
      }

      const session = await this.sessionService.createLoginSession({
        userId: user.id,
      });

      return {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error: any) {
      this.logger.error('Error during login', error);
      throw error;
    }
  }

  async refreshToken(payload: any) {
    try {
      const sessionId = payload.sessionId;

      const session = await this.sessionService.getBySessionId(sessionId);

      if (!session) {
        this.logger.warn(
          `Refresh token failed: Session with ID ${sessionId} not found.`,
        );
        throw new UnauthorizedException('Invalid session');
      }

      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
        role: payload.role,
        sessionId: session.id,
        tenantId: payload.tenantId,
      });

      return { accessToken: newAccessToken };
    } catch (error: any) {
      this.logger.error(`Error refreshing token: ${error}`);
      throw error;
    }
  }
}
