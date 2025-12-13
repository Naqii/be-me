import mongoose, { Schema } from 'mongoose';
import * as Yup from 'yup';

export const TEMPLATE_MODEL_NAME = 'Type';

export const templateDTO = Yup.object({
  name: Yup.string().required(),
  description: Yup.string().required(),
  icon: Yup.string().required(),
});

export type TypeTemplate = Yup.InferType<typeof templateDTO>;

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
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true }
).index({ title: 'text' });

const TemplateModel = mongoose.model(TEMPLATE_MODEL_NAME, templateSchema);

export default TemplateModel;
