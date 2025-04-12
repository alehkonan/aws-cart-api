import { Injectable } from '@nestjs/common';
import { CreateUserAttributes, User } from '../models/user';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async findByName(name: string) {
    const user = await this.userRepository.findOne({
      where: { name },
    });

    return user;
  }

  async create(userAttributes: CreateUserAttributes) {
    // TODO hash password
    const user = this.userRepository.create(userAttributes);
    return user;
  }
}
