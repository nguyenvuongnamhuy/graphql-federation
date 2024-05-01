import { ObjectType, Field } from '@nestjs/graphql';
import { CreateDocQueueInput } from '../dto/create-doc-queue.input';
import { DocQueueItem } from '../proto/doc-queue';

@ObjectType()
export class DocQueue {
  @Field(() => String)
  id: string;

  @Field(() => String)
  bookingNumber: string;

  constructor(init?: Partial<DocQueue>) {
    Object.assign(this, init);
  }

  public static toDomain(payload: CreateDocQueueInput): DocQueue {
    return new DocQueue({
      id: payload.id,
      bookingNumber: payload.bookingNumber ?? '',
    });
  }

  public static toDomains(payload: DocQueueItem[]): DocQueue[] {
    return payload.map((entity) => DocQueue.toDomain(entity));
  }
}
