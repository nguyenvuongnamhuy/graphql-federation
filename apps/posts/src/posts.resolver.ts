import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput): Post {
    return this.postsService.create(createPostInput);
  }

  @Query(() => [Post])
  findAllPosts(): Post[] {
    return this.postsService.findAll();
  }

  // @Query('post')
  // findOne(@Args('id') id: number) {
  //   return this.postsService.findOne(id);
  // }

  // @Mutation('updatePost')
  // update(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
  //   return this.postsService.update(updatePostInput.id, updatePostInput);
  // }

  // @Mutation('removePost')
  // remove(@Args('id') id: number) {
  //   return this.postsService.remove(id);
  // }
}
