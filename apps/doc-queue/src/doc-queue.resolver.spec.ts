import { Test, TestingModule } from '@nestjs/testing';
import { DocQueueResolver } from './doc-queue.resolver';
import { DocQueueService } from './doc-queue.service';

describe('DocQueueResolver', () => {
  let resolver: DocQueueResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocQueueResolver, DocQueueService],
    }).compile();

    resolver = module.get<DocQueueResolver>(DocQueueResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
