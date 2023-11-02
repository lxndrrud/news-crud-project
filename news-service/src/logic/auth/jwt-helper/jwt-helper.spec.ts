import { Test, TestingModule } from '@nestjs/testing';
import { JwtHelper } from './jwt-helper';

describe('JwtHelper', () => {
  let provider: JwtHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtHelper],
    }).compile();

    provider = module.get<JwtHelper>(JwtHelper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
