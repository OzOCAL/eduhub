import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';

describe('AuthModule', () => {
  it('should be defined and compilable', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
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
