import { Controller, Get, Param, Res, NotFoundException, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { Roles } from 'src/auth/decorators/public.decorator';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { Role } from 'generated/prisma';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('resources')
export class ResourcesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get(':id/download')
  async downloadById(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.coursesService.getDocumentById(id);
    const filePath = join(process.cwd(), 'uploads', doc.fileName);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`Fichier introuvable pour le document ${id}`);
    }

    return res.download(filePath, doc.title || doc.fileName);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.coursesService.deleteDocument(id);
  }
}
