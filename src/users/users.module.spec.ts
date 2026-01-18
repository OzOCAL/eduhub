import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';

describe('UsersModule', () => {
  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider('PrismaService')
      .useValue({
        user: {},
      })
      .compile();

    expect(module).toBeDefined();
    await module.init();
  });
});
