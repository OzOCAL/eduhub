import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { CoursesService } from './courses.service';

describe('CoursesController', () => {
  let controller: CoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        { provide: AuthGuard, useValue: { canActivate: () => true } },
        { provide: RolesGuard, useValue: { canActivate: () => true } },
        { provide: PrismaService, useValue: {} },
        { provide: JwtService, useValue: { signAsync: jest.fn(), verifyAsync: jest.fn() } },
        { provide: Reflector, useValue: {} },
        { provide: CoursesService, useValue: {} },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
