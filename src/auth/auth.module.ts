import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RolesGuard } from './auth.guard';
import { ROLES_KEY } from './decorators/public.decorator';
import { PrismaService } from 'src/database/prisma.service';

@Global()
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your_jwt_secret', // Replace with your secret
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    AuthGuard,
    RolesGuard,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule { }