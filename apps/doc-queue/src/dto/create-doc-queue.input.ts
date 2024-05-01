import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDocQueueInput {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  bookingNumber?: string;
}
