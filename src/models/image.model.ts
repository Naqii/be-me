import mongoose, { Schema } from 'mongoose';
import * as Yup from 'yup';

export const IMAGE_MODEL_NAME = 'Image';

export const imageDTO = Yup.object({
  title: Yup.string().required(),
  isShow: Yup.boolean().required(),
  image: Yup.object({
    url: Yup.string().required(),
    publicId: Yup.string().required(),
    resourceType: Yup.mixed<'image'>().oneOf(['image']).required(),
  }).required(),
});

export type ImageAsset = {
  url: string;
  publicId: string;
  resourceType: 'image';
};

export type TypeImage = {
  title: string;
  isShow: boolean;
  image: ImageAsset;
};

interface Image extends TypeImage {}

const imageSchema = new Schema<Image>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    isShow: {
      type: Schema.Types.Boolean,
      required: true,
    },
    image: {
      type: {
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
          enum: ['image', 'video', 'raw'],
          required: true,
        },
      },
    },
  },
  { timestamps: true }
).index({ title: 'text' });

const ImageModel = mongoose.model(IMAGE_MODEL_NAME, imageSchema);

export default ImageModel;
