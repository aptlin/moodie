import { Document as MongooseDocument } from "mongoose";
type PasswordComparison = { err?: Error; same?: boolean };
type PasswordCallback = (passwordComparison: PasswordComparison) => void;

type AppUserRole = "user" | "admin";
interface AppUser {
  name: string;
  email: string;
  password: string;
  role: AppUserRole;
  verified: boolean;
  verification?: string;
  urlTwitter?: string;
  loginAttempts: number;
  blockExpires?: Date;
  following: string[];
  favorites: string[];
}
interface AppUserSchema extends AppUser, MongooseDocument {}

interface AppUserAccess {
  email: string;
  ip: string;
  browser: string;
  country: string;
}

interface AppUserAccessSchema extends AppUserAccess, MongooseDocument {}

interface PasswordResetSchema {}

interface Experience {
  title: string;
  url: string;
  height: number;
  width: number;
  tags: string[];
}

interface ExperienceLog {
  title: string;
  experiences: Experience[];
  isFavorite: boolean;
}

interface ResponseError extends Error {
  status?: number;
  code?: number;
}
