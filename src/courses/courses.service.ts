import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { GetUserDto } from 'src/users/dto/get-user.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { DeleteCourseDto } from './dto/delete-course.dto';
import { existsSync, promises as fsPromises } from 'fs';
import { join } from 'path';

@Injectable()
export class CoursesService {
    constructor(private prismaService: PrismaService) {}

    async getCourses(studentId?: string){
        const where = studentId ? {
            students: {
                some: {
                    id: studentId
                } 
            }
        } : {}
        return this.prismaService.course.findMany({ where });
    }

    async getCoursesByStudentId(getUserDto: GetUserDto) {
        return this.getCourses(getUserDto.id)
    }

    async getCourseById(id: string) {
        const course = await this.prismaService.course.findUnique({
            where: { id },
            include: { teacher: true, students: true, documents: true },
        });

        if (!course) {
            throw new NotFoundException(`Le cours avec l'id ${id} est introuvable`);
        }

        return course;
    }

    async createCourse(createCourseDto: CreateCourseDto) {
        const { teacherId, students, ...rest } = createCourseDto as any;
        const data: any = {
            ...rest,
            teacher: { connect: { id: teacherId } },
        };

        if (students && students.length) {
            data.students = { connect: students.map((id: string) => ({ id })) };
        }

        const course = await this.prismaService.course.create({
            data,
            include: { teacher: true, students: true },
        });
        return course
    }

    async updateCourse(id: string, updateCourseDto: import('./dto/update-course.dto').UpdateCourseDto) {
        const { teacherId, students, ...rest } = updateCourseDto as any;
        const data: any = {
            ...rest,
        };

        if (teacherId !== undefined) {
            data.teacher = { connect: { id: teacherId } };
        }

        if (students !== undefined) {
            data.students = { set: students.map((s: string) => ({ id: s })) };
        }

        const course = await this.prismaService.course.update({
            where: { id },
            data,
            include: { teacher: true, students: true, documents: true },
        });

        return course;
    }

    async createDocumentsFromFiles(courseId: string, files: Express.Multer.File[]) {
        const course = await this.prismaService.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException(`Le cours avec l'id ${courseId} est introuvable`);
        }

        const documents = await Promise.all(
            files.map((file) => {
                return this.prismaService.document.create({
                    data: {
                        title: file.originalname,
                        fileName: file.filename,
                        fileType: file.mimetype,
                        path: `/uploads/${file.filename}`,
                        courseId,
                    },
                });
            }),
        );

        return documents;
    }

    async getCourseDocuments(courseId: string) {
        const course = await this.prismaService.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException(`Le cours avec l'id ${courseId} est introuvable`);
        }

        return this.prismaService.document.findMany({
            where: { courseId },
        });
    }

    async getDocumentById(id: string) {
        const doc = await this.prismaService.document.findUnique({
            where: { id },
        });

        if (!doc) {
            throw new NotFoundException(`Le document avec l'id ${id} est introuvable`);
        }

        return doc;
    }

    async deleteDocument(id: string) {
        const doc = await this.prismaService.document.findUnique({ where: { id } });
        if (!doc) {
            throw new NotFoundException(`Le document avec l'id ${id} est introuvable`);
        }

        const filePath = join(process.cwd(), 'uploads', doc.fileName);
        if (existsSync(filePath)) {
            try {
                await fsPromises.unlink(filePath);
            } catch (err) {
                // On ignore l'erreur de suppression du fichier mais on continue la suppression DB
            }
        }

        await this.prismaService.document.delete({ where: { id } });
        return { success: true } as const;
    }

    async deleteCourse(deleteCourseDto: DeleteCourseDto) {
        const { id } = deleteCourseDto;
        
        const course = await this.prismaService.course.findUnique({
            where: { id },
        });
        
        if (!course) {
            throw new NotFoundException("La matière avec l'id ${id} est introuvable");
        }
        
        return this.prismaService.course.delete({ where: { id } });
    }

    async enrollStudents(courseId: string, studentIds: string[]) {
        const course = await this.prismaService.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException(`Le cours avec l'id ${courseId} est introuvable`);
        }

        const updatedCourse = await this.prismaService.course.update({
            where: { id: courseId },
            data: {
                students: {
                    connect: studentIds.map((id) => ({ id })),
                },
            },
            include: { teacher: true, students: true },
        });

        return updatedCourse;
    }

    async unenrollStudents(courseId: string, studentIds: string[]) {
        const course = await this.prismaService.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException(`Le cours avec l'id ${courseId} est introuvable`);
        }

        const updatedCourse = await this.prismaService.course.update({
            where: { id: courseId },
            data: {
                students: {
                    disconnect: studentIds.map((id) => ({ id })),
                },
            },
            include: { teacher: true, students: true },
        });

        return updatedCourse;
    }
}
