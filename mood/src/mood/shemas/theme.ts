import { Schema } from 'mongoose';

const ThemeSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String },
    experiences: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
    },
  },
  { versionKey: false },
);
ThemeSchema.index({ userId: 1, name: 1 });
export { ThemeSchema };
