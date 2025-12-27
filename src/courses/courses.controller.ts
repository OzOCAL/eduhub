import { Body, Controller, Delete, Get, Param, Post, UseGuards, Patch } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Public, Roles } from 'src/auth/decorators/public.decorator';
import { GetUserDto } from 'src/users/dto/get-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'generated/prisma';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { DeleteCourseDto } from './dto/delete-course.dto';
import { CreateDocumentDto } from './dto/create-document.dto';

@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
    constructor(
        private coursesService: CoursesService,
    ) {}

    @Public()
    @Get()
    async getAllCourses() {
        return this.coursesService.getCourses();
    }

    @Public()
    @Get(':id')
    async getCourseById(@Param('id') id: string) {
        return this.coursesService.getCourseById(id);
    }

    @Public()
    @Get('student/:id')
    async getCoursesByStudentId(@Param() getUserDto: GetUserDto) {
        return this.coursesService.getCoursesByStudentId(getUserDto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Post()
    async createCourse(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.createCourse(createCourseDto)
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Patch(':id')
    async patchCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.updateCourse(id, updateCourseDto);
    }

    @Roles(Role.ADMIN, Role.TEACHER)
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/documents')
    async postDocuments(@Param('id') id: string, @Body() createDocumentDtos: CreateDocumentDto[] | CreateDocumentDto) {
        return this.coursesService.createDocuments(id, createDocumentDtos as CreateDocumentDto[]);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Delete(':id')
    async deleteCourse(@Param() deleteCourseDto: DeleteCourseDto) {
        return this.coursesService.deleteCourse(deleteCourseDto);
    }

    @Roles(Role.ADMIN, Role.TEACHER)
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/enroll')
    async enrollStudents(@Param('id') courseId: string, @Body() body: { studentIds: string[] }) {
        return this.coursesService.enrollStudents(courseId, body.studentIds);
    }

    @Roles(Role.ADMIN, Role.TEACHER)
    @UseGuards(AuthGuard, RolesGuard)
    @Post(':id/unenroll')
    async unenrollStudents(@Param('id') courseId: string, @Body() body: { studentIds: string[] }) {
        return this.coursesService.unenrollStudents(courseId, body.studentIds);
    }
}
