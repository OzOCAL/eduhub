import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { ResourcesController } from 'src/resources/resources.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CoursesService, PrismaService],
  controllers: [CoursesController, ResourcesController]
})
export class CoursesModule {}
