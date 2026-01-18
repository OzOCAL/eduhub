import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@test.com', role: Role.STUDENT },
        { id: '2', email: 'user2@test.com', role: Role.TEACHER },
      ];
      jest.spyOn(mockPrismaService.user, 'findMany').mockResolvedValue(mockUsers);

      const result = await service.getUsers();

      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: '1', email: 'user@test.com', role: Role.STUDENT };
      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.getUserById({ id: '1' });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.getUserById({ id: 'invalid' });

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const createUserDto = {
        email: 'newuser@test.com',
        password: 'password123',
        role: Role.STUDENT,
      };
      const hashedPassword = 'hashed_password';
      const mockCreatedUser = { id: '1', ...createUserDto, password: hashedPassword };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(mockPrismaService.user, 'create').mockResolvedValue(mockCreatedUser);

      const result = await service.createUser(createUserDto as any);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const deleteUserDto = { id: '1' };
      const mockUser = { id: '1', email: 'user@test.com', role: Role.STUDENT };
      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(mockPrismaService.user, 'delete').mockResolvedValue(mockUser);

      const result = await service.deleteUser(deleteUserDto as any);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const deleteUserDto = { id: 'invalid' };
      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteUser(deleteUserDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user as admin', async () => {
      const updateUserDto = { id: '2', email: 'updated@test.com' };
      const currentUser = { id: '1', role: Role.ADMIN } as any;
      const mockUser = { id: '2', email: 'old@test.com' };
      const mockUpdatedUser = { id: '2', email: 'updated@test.com' };

      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(mockPrismaService.user, 'update').mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUser(updateUserDto as any, currentUser);

      expect(result).toEqual(mockUser);
    });

    it('should update own user as student', async () => {
      const updateUserDto = { id: '1', email: 'updated@test.com' };
      const currentUser = { id: '1', role: Role.STUDENT } as any;
      const mockUser = { id: '1', email: 'old@test.com' };

      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(mockPrismaService.user, 'update').mockResolvedValue(mockUser);

      const result = await service.updateUser(updateUserDto as any, currentUser);

      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException when student tries to update another user', async () => {
      const updateUserDto = { id: '2', email: 'updated@test.com' };
      const currentUser = { id: '1', role: Role.STUDENT } as any;
      const mockUser = { id: '2', email: 'other@test.com' };

      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(
        service.updateUser(updateUserDto as any, currentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when user to update does not exist', async () => {
      const updateUserDto = { id: 'invalid', email: 'updated@test.com' };
      const currentUser = { id: '1', role: Role.ADMIN } as any;

      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.updateUser(updateUserDto as any, currentUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should hash password when updating with new password', async () => {
      const updateUserDto = { id: '1', password: 'newpassword' };
      const currentUser = { id: '1', role: Role.STUDENT } as any;
      const mockUser = { id: '1' };
      const hashedPassword = 'hashed_new_password';

      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(mockPrismaService.user, 'update').mockResolvedValue(mockUser);

      await service.updateUser(updateUserDto as any, currentUser);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    });
  });
});
