import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesModule } from './quizzes.module';

describe('QuizzesModule', () => {
  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [QuizzesModule],
    })
      .overrideProvider('PrismaService')
      .useValue({
        quiz: {},
        quizResponse: {},
      })
      .compile();

    expect(module).toBeDefined();
    await module.init();
  });
});
