import { ApiProperty } from '@nestjs/swagger';

export class QuizQuestion {
  @ApiProperty({ description: 'The question text' })
  question: string;

  @ApiProperty({ description: 'Array of possible answers' })
  options: string[];

  @ApiProperty({ description: 'The correct answer index' })
  correctAnswerIndex: number;

  @ApiProperty({ description: 'Explanation for the answer' })
  explanation: string;
}

export class Quiz {
  @ApiProperty({ description: 'The course ID this quiz is for' })
  courseId: string;

  @ApiProperty({ description: 'Array of quiz questions', type: [QuizQuestion] })
  questions: QuizQuestion[];
}