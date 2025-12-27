import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { GetUserDto } from 'src/users/dto/get-user.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { DeleteCourseDto } from './dto/delete-course.dto';

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

    async createDocuments(courseId: string, createDocumentDtos: import('./dto/create-document.dto').CreateDocumentDto[]){
        const docs = Array.isArray(createDocumentDtos) ? createDocumentDtos : [createDocumentDtos];

        const created = await Promise.all(docs.map(dto => {
            const data = { ...dto, courseId } as any;
            return this.prismaService.document.create({ data });
        }));

        return created;
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
