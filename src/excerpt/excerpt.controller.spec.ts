import { Test, TestingModule } from '@nestjs/testing';
import { ExcerptController } from './excerpt.controller';
import { ExcerptService } from './excerpt.service';

describe('ExcerptController', () => {
  let controller: ExcerptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcerptController],
      providers: [ExcerptService],
    }).compile();

    controller = module.get<ExcerptController>(ExcerptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
