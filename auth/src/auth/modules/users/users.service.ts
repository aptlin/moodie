import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { User } from './users.interface';
import {
  RegisterUserDTO,
  ProfileDTO,
  UserDTO,
  ProfileResponseDTO,
} from '../../DTO/users';
import { LoginDTO } from 'src/auth/DTO/auth';
import { compare } from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('User Service');
  constructor(
    @InjectModel('User') private userModel: Model<User & mongoose.Document>,
  ) {}

  async register(registerUserDTO: RegisterUserDTO): Promise<User> {
    const createdUser = new this.userModel(registerUserDTO);
    return await createdUser.save();
  }

  async extractProfile(user: any): Promise<ProfileResponseDTO> {
    const { username, email, firstName, lastName, birthDate } = user;
    return { username, email, firstName, lastName, birthDate };
  }

  async profile(contact: ProfileDTO): Promise<ProfileResponseDTO> {
    const { id } = contact;
    const user = await this.userModel.findById(id);
    return this.extractProfile(user);
  }

  async login(loginObject: LoginDTO): Promise<ProfileDTO> {
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
    };
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async updateLoginDate(email: string) {
    return await this.userModel.update(
      { email },
      { lastLoginDate: Date.now() },
      err => {
        if (err) {
          throw new InternalServerErrorException('Could not update login date');
        }
        this.logger.verbose(`New login: ${email}`);
      },
    );
  }
}
