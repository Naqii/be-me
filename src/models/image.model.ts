import mongoose, { Schema } from 'mongoose';
import * as Yup from 'yup';

export const IMAGE_MODEL_NAME = 'Image';

export const imageDTO = Yup.object({
  title: Yup.string().required(),
  image: Yup.string().required(),
  isShow: Yup.boolean().required(),
});

export type TypeImage = Yup.InferType<typeof imageDTO>;

interface Image extends TypeImage {}

const imageSchema = new Schema<Image>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },

    image: {
      type: Schema.Types.String,
      required: true,
    },

    isShow: {
      type: Schema.Types.Boolean,
      required: true,
    },
  },
  { timestamps: true }
).index({ title: 'text' });

const ImageModel = mongoose.model(IMAGE_MODEL_NAME, imageSchema);

export default ImageModel;
