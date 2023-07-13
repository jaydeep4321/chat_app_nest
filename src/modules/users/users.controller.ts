import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async finAll(@Res() res) {
    const users = await this.userService.getUserData();
    return users;
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Res() res) {
    const user = await this.userService.findOneById(parseInt(id));

    // user.password = undefined;
    return user;
  }

  @Post()
  async createUser(@Body() body: User) {
    const user = await this.userService.createUser(body);
    return user;
  }
}
