import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { User } from './users.interface';
import { RegisterUserDTO } from '../DTO/users';
import { LoginDTO } from 'src/auth/DTO/auth';
import { compare } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User & mongoose.Document>,
  ) {}

  async register(registerUserDTO: RegisterUserDTO): Promise<User> {
    const createdUser = new this.userModel(registerUserDTO);
    return await createdUser.save();
  }

  async login(loginObject: LoginDTO) {
    const { email, password: passwordAttempt } = loginObject;

    const user = await this.findOneByEmail(email);

    if (!user) {
      return Promise.resolve(null);
    }

    const passwordMatch = await compare(passwordAttempt, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
    };
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
