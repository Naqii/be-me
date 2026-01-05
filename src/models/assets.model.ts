import mongoose, { Date, ObjectId, Schema } from 'mongoose';
import * as Yup from 'yup';

export const ASSETS_MODEL_NAME = 'Assets';

export const assetsDTO = Yup.object({
  title: Yup.string().required(),
  type: Yup.string().required(),
  isShow: Yup.boolean().required(),
  thumbnail: Yup.object({
    url: Yup.string().required(),
    publicId: Yup.string().required(),
    resourceType: Yup.mixed<'image'>().oneOf(['image']).required(),
  }).required(),
  asset: Yup.object({
    url: Yup.string().required(),
    publicId: Yup.string().required(),
    resourceType: Yup.mixed<'raw'>().oneOf(['raw']).required(),
  }).required(),
  updated: Yup.date().required(),
});

export type MediaAssets = {
  url: string;
  publicId: string;
  resourceType: 'image' | 'raw';
};

export type TypeAssets = {
  title: string;
  type: ObjectId;
  isShow: boolean;
  thumbnail: MediaAssets;
  asset: MediaAssets;
  updated: Date;
};

interface Assets extends TypeAssets {}

const assetSchema = new Schema<Assets>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      unique: true,
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

    thumbnail: {
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
          enum: ['image'],
          required: true,
        },
      },
    },

    asset: {
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
          enum: ['raw'],
          required: true,
        },
      },
    },
  },
  { timestamps: true }
).index({ title: 'text' });

const AssetModel = mongoose.model(ASSETS_MODEL_NAME, assetSchema);

export default AssetModel;
