import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepo } from './auth-repo';

describe('AuthRepo', () => {
  let provider: AuthRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthRepo],
    }).compile();

    provider = module.get<AuthRepo>(AuthRepo);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
