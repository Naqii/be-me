import mongoose, { Schema } from 'mongoose';
import * as Yup from 'yup';

export const WORK_MODEL_NAME = 'Work';

export const workDTO = Yup.object({
  title: Yup.string().required(),
  thumbnail: Yup.string().required(),
  content: Yup.string().required(),
  description: Yup.string().required(),
  isShow: Yup.boolean().required(),
  dateFinished: Yup.date().required(),
});

export type TypeWork = Yup.InferType<typeof workDTO>;

interface Work extends TypeWork {}

const workSchema = new Schema<Work>(
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
      type: Schema.Types.Date,
      required: true,
    },
  },
  { timestamps: true }
).index({ title: 'text' });

const WorkModel = mongoose.model(WORK_MODEL_NAME, workSchema);

export default WorkModel;
