import { Schema } from 'mongoose';

const ExperienceSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    isFavorite: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
  },
);

ExperienceSchema.index({ userId: 1, name: 1 });
export { ExperienceSchema };
