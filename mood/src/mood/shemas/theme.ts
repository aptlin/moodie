import * as mongoosePaginate from 'mongoose-paginate';
import { Schema } from 'mongoose';

const ThemeSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String },
  experiences: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
  },
});
ThemeSchema.index({ userId: 1, name: 1 });
ThemeSchema.plugin(mongoosePaginate);
export { ThemeSchema };
