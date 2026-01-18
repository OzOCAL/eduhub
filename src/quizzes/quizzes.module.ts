import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Module({
  providers: [QuizzesService]
})
export class QuizzesModule {}
