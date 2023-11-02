import { Test, TestingModule } from '@nestjs/testing';
import { Hasher } from './hasher';

describe('Hasher', () => {
  let provider: Hasher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Hasher],
    }).compile();

    provider = module.get<Hasher>(Hasher);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
