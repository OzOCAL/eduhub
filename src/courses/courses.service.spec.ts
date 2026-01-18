import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';

describe('CoursesService', () => {
  let service: CoursesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    course: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    document: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCourses', () => {
    it('should return all courses when no studentId is provided', async () => {
      const mockCourses = [
        { id: '1', title: 'Math 101', teacherId: 'teacher1' },
        { id: '2', title: 'English 101', teacherId: 'teacher2' },
      ];
      jest.spyOn(mockPrismaService.course, 'findMany').mockResolvedValue(mockCourses);

      const result = await service.getCourses();

      expect(mockPrismaService.course.findMany).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual(mockCourses);
    });

    it('should return courses for a specific student', async () => {
      const mockCourses = [{ id: '1', title: 'Math 101' }];
      jest.spyOn(mockPrismaService.course, 'findMany').mockResolvedValue(mockCourses);

      const result = await service.getCourses('student1');

      expect(mockPrismaService.course.findMany).toHaveBeenCalledWith({
        where: { students: { some: { id: 'student1' } } },
      });
      expect(result).toEqual(mockCourses);
    });
  });

  describe('getCourseById', () => {
    it('should return a course by id', async () => {
      const mockCourse = {
        id: '1',
        title: 'Math 101',
        teacher: { id: 'teacher1' },
        students: [],
        documents: [],
      };
      jest.spyOn(mockPrismaService.course, 'findUnique').mockResolvedValue(mockCourse);

      const result = await service.getCourseById('1');

      expect(mockPrismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { teacher: true, students: true, documents: true },
      });
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException when course does not exist', async () => {
      jest.spyOn(mockPrismaService.course, 'findUnique').mockResolvedValue(null);

      await expect(service.getCourseById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createCourse', () => {
    it('should create a course without students', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'New Course',
        description: 'Description',
        teacherId: 'teacher1',
      };
      const mockCreatedCourse = {
        id: '1',
        ...createCourseDto,
        teacher: { id: 'teacher1' },
        students: [],
      };
      jest.spyOn(mockPrismaService.course, 'create').mockResolvedValue(mockCreatedCourse);

      const result = await service.createCourse(createCourseDto);

      expect(mockPrismaService.course.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedCourse);
    });

    it('should create a course with students', async () => {
      const createCourseDto = {
        title: 'New Course',
        description: 'Description',
        teacherId: 'teacher1',
        students: ['student1', 'student2'],
      };
      const mockCreatedCourse = {
        id: '1',
        ...createCourseDto,
        teacher: { id: 'teacher1' },
        students: [{ id: 'student1' }, { id: 'student2' }],
      };
      jest.spyOn(mockPrismaService.course, 'create').mockResolvedValue(mockCreatedCourse);

      const result = await service.createCourse(createCourseDto as any);

      expect(mockPrismaService.course.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedCourse);
    });
  });

  describe('updateCourse', () => {
    it('should update a course', async () => {
      const updateCourseDto = { title: 'Updated Title' };
      const mockUpdatedCourse = {
        id: '1',
        title: 'Updated Title',
        teacher: { id: 'teacher1' },
        students: [],
        documents: [],
      };
      jest.spyOn(mockPrismaService.course, 'update').mockResolvedValue(mockUpdatedCourse);

      const result = await service.updateCourse('1', updateCourseDto as any);

      expect(mockPrismaService.course.update).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedCourse);
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course', async () => {
      const deleteCourseDto = { id: '1' };
      const mockCourse = { id: '1', title: 'Math 101' };
      jest.spyOn(mockPrismaService.course, 'findUnique').mockResolvedValue(mockCourse);
      jest.spyOn(mockPrismaService.course, 'delete').mockResolvedValue(mockCourse);

      const result = await service.deleteCourse(deleteCourseDto as any);

      expect(mockPrismaService.course.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockPrismaService.course.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException when course does not exist', async () => {
      const deleteCourseDto = { id: 'invalid' };
      jest.spyOn(mockPrismaService.course, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteCourse(deleteCourseDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getDocumentById', () => {
    it('should return a document by id', async () => {
      const mockDocument = { id: '1', title: 'Doc1.pdf', fileName: 'doc1.pdf' };
      jest.spyOn(mockPrismaService.document, 'findUnique').mockResolvedValue(mockDocument);

      const result = await service.getDocumentById('1');

      expect(mockPrismaService.document.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException when document does not exist', async () => {
      jest.spyOn(mockPrismaService.document, 'findUnique').mockResolvedValue(null);

      await expect(service.getDocumentById('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const mockDoc = { id: '1', fileName: 'doc.pdf' };
      jest.spyOn(mockPrismaService.document, 'findUnique').mockResolvedValue(mockDoc);
      jest.spyOn(mockPrismaService.document, 'delete').mockResolvedValue(mockDoc);

      const result = await service.deleteDocument('1');

      expect(mockPrismaService.document.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockPrismaService.document.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException when document does not exist', async () => {
      jest.spyOn(mockPrismaService.document, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteDocument('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
