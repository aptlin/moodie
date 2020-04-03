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

export interface Mood {
  userId: string;
  themes: mongoose.Types.ObjectId[];
}
