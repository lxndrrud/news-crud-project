import { Inject, Injectable } from '@nestjs/common';
import { TYPEORM_CONNECTION } from '../../../database/TypeormConnection';
import { DataSource } from 'typeorm';
import { RegisterUserDto } from '../dto/RegisterUser.dto';
import { User } from '../../../database/entities/User.entity';

export const AUTH_REPO = 'AUTH_REPO';

export interface IAuthRepo {
  createUser(payload: RegisterUserDto): Promise<void>;
  getUserByEmail(email: string): Promise<User | null>;
}

@Injectable()
export class AuthRepo implements IAuthRepo {
  constructor(
    @Inject(TYPEORM_CONNECTION) private readonly connection: DataSource,
  ) {}

  async createUser(payload: RegisterUserDto) {
    const newUser = new User();
    newUser.email = payload.email;
    newUser.password = payload.password;

    await this.connection.createEntityManager().save(newUser);
  }

  async getUserByEmail(email: string) {
    const user = await this.connection
      .createQueryBuilder(User, 'user')
      .where('user.email = :email', { email })
      .getOne();
    return user;
  }
}
