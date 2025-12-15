import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user && user.password === password) {
      // Generate JWT token
      const payload = { sub: user.id, email: user.email };
      return await this.jwtService.signAsync(payload);
    }

    throw new UnauthorizedException();
  }
}
