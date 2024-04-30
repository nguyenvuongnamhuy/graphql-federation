import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateDocQueueInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  bookingNumber: string;
}
