import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from './resources.controller';
import { CoursesService } from '../courses/courses.service';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ResourcesController', () => {
  let controller: ResourcesController;
  let coursesService: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [
        { provide: AuthGuard, useValue: { canActivate: () => true } },
        { provide: RolesGuard, useValue: { canActivate: () => true } },
        { provide: PrismaService, useValue: {} },
        { provide: JwtService, useValue: { signAsync: jest.fn(), verifyAsync: jest.fn() } },
        { provide: Reflector, useValue: {} },
        {
          provide: CoursesService,
          useValue: {
            getDocumentById: jest.fn(),
            deleteDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
    coursesService = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('downloadById', () => {
    it('should throw NotFoundException if file does not exist', async () => {
      const mockDoc = { id: '1', fileName: 'test.pdf', title: 'Test' };
      jest.spyOn(coursesService, 'getDocumentById').mockResolvedValue(mockDoc as any);

      const mockRes = {
        download: jest.fn(),
      } as any;

      await expect(controller.downloadById('1', mockRes)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteById', () => {
    it('should call deleteDocument with correct id', async () => {
      const mockResult = { id: '1', fileName: 'test.pdf' };
      jest.spyOn(coursesService, 'deleteDocument').mockResolvedValue(mockResult as any);

      const result = await controller.deleteById('1');

      expect(coursesService.deleteDocument).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });
});
