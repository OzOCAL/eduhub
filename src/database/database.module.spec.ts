import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';

describe('DatabaseModule', () => {
  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    })
      .overrideProvider('PrismaService')
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      })
      .compile();

    expect(module).toBeDefined();
    await module.init();
  });
});
