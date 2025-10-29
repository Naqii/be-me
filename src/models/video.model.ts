import mongoose, { Schema } from 'mongoose';
import * as Yup from 'yup';

export const VIDEO_MODEL_NAME = 'Video';

export const videoDTO = Yup.object({
  title: Yup.string().required(),
  video: Yup.string().required(),
  isShow: Yup.boolean().required(),
});

export type TypeVideo = Yup.InferType<typeof videoDTO>;

interface Video extends TypeVideo {}

const VideoSchema = new Schema<Video>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },

    video: {
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

const VideoModel = mongoose.model(VIDEO_MODEL_NAME, VideoSchema);

export default VideoModel;
