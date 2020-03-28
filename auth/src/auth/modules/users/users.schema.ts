import { genSalt, hash } from 'bcryptjs';
import * as mongoose from 'mongoose';
import { isEmail } from 'validator';
import { User } from './users.interface';

export const UserSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [isEmail, 'invalid email'],
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
  },
  lastLoginDate: {
    type: Date,
    default: null,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
});

async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(12);
  const hashedPassword = await hash(password, salt);

  return hashedPassword;
}

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const user = this as User & mongoose.Document;
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;
});
