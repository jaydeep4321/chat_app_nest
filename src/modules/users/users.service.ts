import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from 'src/core/constants';

@Injectable()
export class UsersService {
  create(body: User) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async createUser(user: User): Promise<User> {
    return await this.userRepository.create(user);
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async getUserData(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}