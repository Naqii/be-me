import mongoose, { Date, ObjectId, Schema } from 'mongoose';
import * as Yup from 'yup';

export const ASSETS_MODEL_NAME = 'Assets';

export const assetsDTO = Yup.object({
  title: Yup.string().required(),
  thumbnail: Yup.string().required(),
  asset: Yup.string().required(),
  type: Yup.string().required(),
  isShow: Yup.boolean().required(),
  updated: Yup.date().required(),
});

export type TypeAssets = Yup.InferType<typeof assetsDTO>;

export interface Assets extends Omit<TypeAssets, 'type' | 'updated'> {
  type: ObjectId;
  updated: Date;
}

const assetSchema = new Schema<Assets>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },

    thumbnail: {
      type: Schema.Types.String,
      required: true,
    },

    asset: {
      type: Schema.Types.String,
      required: true,
    },

    type: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    isShow: {
      type: Schema.Types.Boolean,
      required: true,
    },

    updated: {
      type: Schema.Types.Date,
      required: true,
    },
  },
  { timestamps: true }
).index({ title: 'text' });

const AssetModel = mongoose.model(ASSETS_MODEL_NAME, assetSchema);

export default AssetModel;
