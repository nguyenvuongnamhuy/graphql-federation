import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  constructor({ id, email }) {
    this.id = id;
    this.email = email;
  }

  @Field()
  id: number;

  @Field()
  email: string;
}
