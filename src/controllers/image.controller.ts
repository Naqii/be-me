import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../utils/interface';
import response from '../utils/response';
import { FilterQuery, isValidObjectId } from 'mongoose';
import uploader from '../utils/uploader';
import ImageModel, { imageDTO, TypeImage } from '../models/image.model';

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body } as TypeImage;

      const existingByTitle = await ImageModel.findOne({
        title: payload.title,
      });
      if (existingByTitle)
        return response.error(
          res,
          null,
          'Image with the same title already exists'
        );

      await imageDTO.validate(payload);
      const result = await ImageModel.create(payload);
      response.success(res, result, 'success to create a image');
    } catch (error) {
      response.error(res, error, 'failed to create a image');
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeImage> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await ImageModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await ImageModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        'success find All images'
      );
    } catch (error) {
      response.error(res, error, 'failed to find all images');
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed find a image');
      }

      const result = await ImageModel.findById(id);

      if (!result) {
        return response.notFound(res, 'failed find a image');
      }

      response.success(res, result, 'success find one image');
    } catch (error) {
      response.error(res, error, 'failed to find a image');
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to update a image');
      }

      const result = await ImageModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, 'success update a image');
    } catch (error) {
      response.error(res, error, 'failed to update a image');
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to remove a image');
      }

      const result = await ImageModel.findByIdAndDelete(id, {
        new: true,
      });

      if (!result) return response.notFound(res, 'image not found');

      await uploader.remove(result?.image);

      response.success(res, result, 'success remove a banner');
    } catch (error) {
      response.error(res, error, 'failed to remove a banner');
    }
  },
};
