import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { DocQueueService } from '../service/doc-queue.service';
import { CreateDocQueueInput } from '../dto/create-doc-queue.input';
import { DocQueue } from '../entities/doc-queue.entity';
import { Logger } from '@nestjs/common';
import { HttpApiResponse } from 'apps/shared/response/api-restful.response';
import { DocQueueListRequest, DocQueuePagination } from '../proto/doc-queue';
import { firstValueFrom } from 'rxjs';
import { GrpcException } from 'apps/shared/filter/grpc/grpc.exception';

@Resolver('DocQueue')
export class DocQueueResolver {
  private readonly logger: Logger = new Logger(DocQueueService.name);

  constructor(private readonly docQueueService: DocQueueService) {}

  @Mutation(() => DocQueue)
  createDocQueue(@Args('createDocQueueInput') createDocQueueInput: CreateDocQueueInput): DocQueue {
    this.logger.log({ createDocQueueInput });
    return this.docQueueService.createDocQueue(createDocQueueInput);
  }

  @Query(() => [DocQueue])
  async getQueueList(): Promise<DocQueue[]> {
    try {
      const request: DocQueueListRequest = { bookingNumber: '', page: 1, size: 10 };
      const result = await firstValueFrom(this.docQueueService.getQueueList('blink', request));
      const response = HttpApiResponse.handle<DocQueuePagination>(result);
      this.logger.log({ response });
      const data = response.data.items.map((d) => {
        return {
          id: d.id,
          bookingNumber: d.bookingNumber,
        };
      });
      return data;
    } catch (err) {
      throw new GrpcException(err);
    }
  }
}
