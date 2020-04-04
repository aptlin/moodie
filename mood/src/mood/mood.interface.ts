import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface Experience {
  userId: string;
  name: string;
  isFavorite: boolean;
}

export interface Theme {
  userId: string;
  name: string;
  experiences: mongoose.Types.ObjectId[];
}

export interface PaginatedTheme extends Document {
  userId: string;
  name: string;
  experiences: (Experience & Document)[];
}

export interface Mood {
  userId: string;
  themes: mongoose.Types.ObjectId[];
}
