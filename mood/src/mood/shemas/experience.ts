import * as mongoosePaginate from 'mongoose-paginate';
import { Schema } from 'mongoose';

const ExperienceSchema = new Schema({
  userId: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  isFavorite: {
    type: Boolean,
  },
});

ExperienceSchema.index({ userId: 1, name: 1 });
ExperienceSchema.plugin(mongoosePaginate);
export { ExperienceSchema };
