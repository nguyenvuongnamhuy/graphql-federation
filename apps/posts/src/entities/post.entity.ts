import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Post {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
  }

  @Field()
  id: number;

  @Field()
  title: string;
}
