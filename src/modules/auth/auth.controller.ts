import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import type { Response } from 'express';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshToken(req.user);

    const { accessToken } = result;

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('access_token', accessToken, {
      domain: isProd ? '.thevioletmemorial.org' : undefined,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login({ userId: req.user.id });

    if (!result) {
      throw new Error('Login failed');
    }

    const { accessToken, refreshToken, user } = result;

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('access_token', accessToken, {
      domain: isProd ? '.thevioletmemorial.org' : undefined,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      domain: isProd ? '.thevioletmemorial.org' : undefined,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });

    return { user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('access_token', {
      domain: isProd ? '.thevioletmemorial.org' : undefined,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}
