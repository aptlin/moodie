import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { User } from './users.interface';
import { RegisterUserDTO } from './DTO';
import { LoginDTO } from 'src/auth/DTO';
import { compare } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User & mongoose.Document>,
  ) {}

  async register(registerUserDTO: RegisterUserDTO) {
    const createdUser = new this.userModel(registerUserDTO);
    return await createdUser.save();
  }

  async login(loginObject: LoginDTO) {
    const { email, password } = loginObject;

    const user = await this.findOneByEmail(email);

    if (!user) {
      return Promise.resolve(null);
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
