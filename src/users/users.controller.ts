import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public, Roles } from 'src/auth/decorators/public.decorator';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Role } from 'generated/prisma';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Public()
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Public()
  @Get(':id')
  async getUserById(@Param() getUserDto: GetUserDto) {
    return this.usersService.getUserById(getUserDto);
  }

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }


  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete()
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.deleteUser(deleteUserDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put()
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const currentUser = req.user;
    return this.usersService.updateUser(updateUserDto, currentUser);
  }
}
