import mongoose, { Schema } from 'mongoose';
import * as Yup from 'yup';

export const URL_MODEL_SHORTENER = 'Url';

const validateCustomAlias = Yup.string()
  .matches(
    /^[a-zA-Z0-9 _-]+$/,
    'Custom alias must only contain letters and numbers'
  )
  .optional();

export const urlDTO = Yup.object({
  originalUrl: Yup.string().required(),
  customAlias: validateCustomAlias,
  newUrl: Yup.string(),
  isActive: Yup.boolean(),
});

export type TypeUrl = Yup.InferType<typeof urlDTO>;

interface Url extends TypeUrl {}

const UrlSchema = new Schema<Url>(
  {
    originalUrl: {
      type: Schema.Types.String,
      required: true,
    },
    customAlias: {
      type: Schema.Types.String,
    },
    newUrl: {
      type: Schema.Types.String,
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const UrlModel = mongoose.model(URL_MODEL_SHORTENER, UrlSchema);

export default UrlModel;
