import { Test, TestingModule } from '@nestjs/testing';
import { ToDosResolver } from './to-dos.resolver';

describe('ToDosResolver', () => {
  let resolver: ToDosResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToDosResolver],
    }).compile();

    resolver = module.get<ToDosResolver>(ToDosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
