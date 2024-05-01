import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateDocQueueInput } from '../dto/create-doc-queue.input';
import { DocQueue } from '../entities/doc-queue.entity';
import { DOC_QUEUE_SERVICE_NAME, DocQueueListRequest, DocQueueListResponse, DocQueueServiceClient } from '../proto/doc-queue';
import { Observable } from 'rxjs';
import { MetadataEx } from 'apps/shared/util/grpc-metadata.util';
import { DOCS_CLIENT_SERVICE } from 'apps/shared/constant';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class DocQueueService {
  private readonly logger: Logger = new Logger(DocQueueService.name);

  private queueServiceClient: DocQueueServiceClient;

  constructor(@Inject(DOCS_CLIENT_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.queueServiceClient = this.client.getService<DocQueueServiceClient>(DOC_QUEUE_SERVICE_NAME);
  }

  createDocQueue(createDocQueueInput: CreateDocQueueInput): DocQueue {
    try {
      return new DocQueue({ id: createDocQueueInput.id || '1', bookingNumber: createDocQueueInput.bookingNumber || 'ABC' });
    } catch (error) {
      this.logger.log({
        error: error,
      });
    }
  }

  getQueueList(email: string, queueRequest: DocQueueListRequest): Observable<DocQueueListResponse> {
    const metadata = new MetadataEx();
    metadata.add('email', email);
    return this.queueServiceClient.getDocQueueList(queueRequest, metadata);
  }
}
