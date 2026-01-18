import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a jwt token for valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'user@test.com',
        password: 'hashed_password',
      };
      const mockToken = 'jwt_token_here';

      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(mockJwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await service.signIn('user@test.com', 'password123');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toBe(mockToken);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = {
        id: '1',
        email: 'user@test.com',
        password: 'hashed_password',
      };

      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn('user@test.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.signIn('nonexistent@test.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
