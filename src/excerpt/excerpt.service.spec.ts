import { Test, TestingModule } from '@nestjs/testing';
import { ExcerptService } from './excerpt.service';

describe('ExcerptService', () => {
  let service: ExcerptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcerptService],
    }).compile();

    service = module.get<ExcerptService>(ExcerptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
