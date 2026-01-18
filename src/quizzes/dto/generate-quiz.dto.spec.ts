import { validate } from 'class-validator';
import { GenerateQuizDto } from './generate-quiz.dto';

describe('GenerateQuizDto', () => {
  it('should validate with valid data', async () => {
    const dto = new GenerateQuizDto();
    dto.courseId = 'cmj8db5s60000cb4dfuvip74a';
    dto.numberOfQuestions = 5;
    dto.difficulty = 'medium';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation without courseId', async () => {
    const dto = new GenerateQuizDto();
    dto.numberOfQuestions = 5;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('courseId');
  });

  it('should fail validation with invalid numberOfQuestions (too low)', async () => {
    const dto = new GenerateQuizDto();
    dto.courseId = 'cmj8db5s60000cb4dfuvip74a';
    dto.numberOfQuestions = 0;

    const errors = await validate(dto);
    const hasMinError = errors.some(
      (e) => e.property === 'numberOfQuestions' && e.constraints?.min
    );
    expect(hasMinError).toBe(true);
  });

  it('should fail validation with invalid numberOfQuestions (too high)', async () => {
    const dto = new GenerateQuizDto();
    dto.courseId = 'cmj8db5s60000cb4dfuvip74a';
    dto.numberOfQuestions = 21;

    const errors = await validate(dto);
    const hasMaxError = errors.some(
      (e) => e.property === 'numberOfQuestions' && e.constraints?.max
    );
    expect(hasMaxError).toBe(true);
  });
});
