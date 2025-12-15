import { Body, Delete, ForbiddenException, Injectable, NotFoundException, Post, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Role, User } from 'generated/prisma';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUsers() {
    return this.prismaService.user.findMany();
  }

  async getUserById(getUserDto: GetUserDto) {
    const id = getUserDto;

    const user = await this.prismaService.user.findUnique({
      where: id,
    })

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: createUserDto,
    });
    return user;
  }

  async deleteUser(deleteUserDto: DeleteUserDto): Promise <User> {
    const { id } = deleteUserDto;

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
    throw new NotFoundException("L'élève avec l'id ${id} est introuvable");
    }

    return this.prismaService.user.delete({ where: { id } });
  }

  async updateUser(updateUserDto: UpdateUserDto, currentUser: User): Promise <User> {
    const { id } = updateUserDto;

    const userToUpdate = await this.prismaService.user.findUnique({
      where: { id },
    })

    if (!userToUpdate) {
      throw new NotFoundException("L'utilisateur est introuvable");
    }

    console.log('currentUser:', currentUser);


    if (currentUser.role !== Role.ADMIN && updateUserDto.id !== currentUser.id){
      throw new ForbiddenException("Vous n'êtes pas autotisé à modifier ce compte")
    }

    await this.prismaService.user.update({
      where: {id : updateUserDto.id},
      data: updateUserDto,
    });

    return userToUpdate;
  }
}
