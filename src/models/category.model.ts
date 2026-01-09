import mongoose, { Schema } from 'mongoose';
import * as Yup from 'yup';

export const CATEGORY_MODEL_NAME = 'Category';

export const categoryDTO = Yup.object({
  name: Yup.string().required(),
  description: Yup.string().required(),
  icon: Yup.object({
    url: Yup.string().required(),
    publicId: Yup.string().required(),
    resourceType: Yup.mixed<'image'>().oneOf(['image']).required(),
  }).required(),
});

export type IconAsset = {
  url: string;
  publicId: string;
  resourceType: 'image';
};

export type TypeCategory = {
  name: string;
  description: string;
  icon: IconAsset;
};

interface Category extends TypeCategory {}

const categorySchema = new Schema<Category>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },

    description: {
      type: Schema.Types.String,
      required: true,
    },

    icon: {
      url: {
        type: Schema.Types.String,
        required: true,
      },
      publicId: {
        type: Schema.Types.String,
        required: true,
      },
      resourceType: {
        type: Schema.Types.String,
        enum: ['image'],
        required: true,
      },
    },
  },
  { timestamps: true }
).index({ name: 'text' });

const CategoryModel = mongoose.model(CATEGORY_MODEL_NAME, categorySchema);

export default CategoryModel;
