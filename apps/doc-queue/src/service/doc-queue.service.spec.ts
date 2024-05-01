import { Test, TestingModule } from '@nestjs/testing';
import { DocQueueService } from './doc-queue.service';

describe('DocQueueService', () => {
  let service: DocQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocQueueService],
    }).compile();

    service = module.get<DocQueueService>(DocQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
