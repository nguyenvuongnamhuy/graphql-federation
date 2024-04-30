import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DocQueue {
  constructor({ id, bookingNumber }) {
    this.id = id;
    this.bookingNumber = bookingNumber;
  }

  @Field()
  id: string;

  @Field()
  bookingNumber: string;
}
