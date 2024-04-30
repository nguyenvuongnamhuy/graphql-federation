import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput): User {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User])
  findAllUsers(): User[] {
    return this.usersService.findAll();
  }

  // @Query(() => User)
  // findOne(@Args('id') id: number) {
  //   return this.usersService.findOne(id);
  // }

  // @Mutation(() => User)
  // update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  // @Mutation(() => User)
  // remove(@Args('id') id: number) {
  //   return this.usersService.remove(id);
  // }
}
