import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateQuizDto {
  @ApiProperty({
    description: 'The course ID to generate a quiz for',
    example: 'cmj8db5s60000cb4dfuvip74a',
  })
  @IsString()
  courseId: string;

  @ApiProperty({
    description: 'Number of questions to generate',
    example: 5,
    required: false,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  numberOfQuestions?: number = 5;
}