import mongoose, { Schema } from 'mongoose';
import * as Yup from 'yup';

export const TEMPLATE_MODEL_NAME = 'Type';

export const templateDTO = Yup.object({
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

export type TypeTemplate = {
  name: string;
  description: string;
  icon: IconAsset;
};

interface Template extends TypeTemplate {}

const templateSchema = new Schema<Template>(
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
).index({ title: 'text' });

const TemplateModel = mongoose.model(TEMPLATE_MODEL_NAME, templateSchema);

export default TemplateModel;
