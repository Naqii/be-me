import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../utils/interface';
import VideoModel, { TypeVideo, videoDTO } from '../models/video.model';
import response from '../utils/response';
import { FilterQuery, isValidObjectId } from 'mongoose';
import uploader from '../utils/uploader';

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body } as TypeVideo;

      const existingByTitle = await VideoModel.findOne({
        title: payload.title,
      });
      if (existingByTitle)
        return response.error(
          res,
          null,
          'Video with the same title already exists'
        );

      await videoDTO.validate(payload);
      const result = await VideoModel.create(payload);
      response.success(res, result, 'success to create a video');
    } catch (error) {
      response.error(res, error, 'failed to create a video');
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeVideo> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await VideoModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await VideoModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        'success find All videos'
      );
    } catch (error) {
      response.error(res, error, 'failed to find all videos');
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed find a video');
      }

      const result = await VideoModel.findById(id);

      if (!result) {
        return response.notFound(res, 'failed find a video');
      }

      response.success(res, result, 'success find one video');
    } catch (error) {
      response.error(res, error, 'failed to find a video');
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to update a video');
      }

      const result = await VideoModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, 'success update a video');
    } catch (error) {
      response.error(res, error, 'failed to update a video');
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to remove a video');
      }

      const result = await VideoModel.findByIdAndDelete(id, {
        new: true,
      });

      if (!result) return response.notFound(res, 'Video not found');

      response.success(res, result, 'success remove a video');
    } catch (error) {
      response.error(res, error, 'failed to remove a video');
    }
  },
};
