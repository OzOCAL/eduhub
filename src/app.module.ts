import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { QuizzesModule } from './quizzes/quizzes.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, UsersModule, CoursesModule, QuizzesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
