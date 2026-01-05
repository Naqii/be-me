import mongoose, { Schema } from 'mongoose';
import * as Yup from 'yup';

export const WORK_MODEL_NAME = 'Work';

export const workDTO = Yup.object({
  title: Yup.string().required(),
  thumbnail: Yup.object({
    url: Yup.string().required(),
    publicId: Yup.string().required(),
    resourceType: Yup.mixed<'image'>().oneOf(['image']).required(),
  }).required(),
  content: Yup.string().required(),
  description: Yup.string().required(),
  isShow: Yup.boolean().required(),
  dateFinished: Yup.string().required(),
});

export type WorkAssets = {
  url: string;
  publicId: string;
  resourceType: 'image';
};

export type TypeWork = {
  title: string;
  content: string;
  description: string;
  isShow: boolean;
  thumbnail: WorkAssets;
  dateFinished: string;
};

interface Work extends TypeWork {}

const workSchema = new Schema<Work>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      unique: true,
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

    content: {
      type: Schema.Types.String,
      required: true,
    },

    description: {
      type: Schema.Types.String,
      required: true,
    },

    isShow: {
      type: Schema.Types.Boolean,
      required: true,
    },

    dateFinished: {
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true }
).index({ title: 'text' });

const WorkModel = mongoose.model(WORK_MODEL_NAME, workSchema);

export default WorkModel;
