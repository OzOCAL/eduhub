import { Test, TestingModule } from '@nestjs/testing';
import { CoursesModule } from './courses.module';

describe('CoursesModule', () => {
  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoursesModule],
    })
      .overrideProvider('PrismaService')
      .useValue({
        course: {},
        document: {},
      })
      .compile();

    expect(module).toBeDefined();
    await module.init();
  });
});
