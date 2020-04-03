import { Schema } from 'mongoose';

const MoodSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    themes: [{ type: Schema.Types.ObjectId, ref: 'Theme' }],
  },
  { versionKey: false },
);

MoodSchema.index({ userId: 1 });

export { MoodSchema };
