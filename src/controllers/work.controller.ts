import { FilterQuery, isValidObjectId } from 'mongoose';
import WorkModel, { TypeWork, workDTO } from '../models/work.model';
import { IPaginationQuery, IReqUser } from '../utils/interface';
import response from '../utils/response';
import { Response } from 'express';
import uploader from '../utils/uploader';

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body } as TypeWork;

      const existingByTitle = await WorkModel.findOne({
        title: payload.title,
      });
      if (existingByTitle) {
        return response.error(
          res,
          null,
          'Assets with the same title alredy exists'
        );
      }
      await workDTO.validate(payload);
      const result = await WorkModel.create(payload);
      response.success(res, result, 'success to create an assets');
    } catch (error) {
      response.error(res, error, 'failed to create an assets');
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeWork> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await WorkModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await WorkModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        'success find All Works'
      );
    } catch (error) {
      response.error(res, error, 'failed to find all Works');
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed find one work');
      }

      const result = await WorkModel.findById(id);

      if (!result) {
        return response.notFound(res, 'failed find one work');
      }

      response.success(res, result, 'success find one work');
    } catch (error) {
      response.error(res, error, 'failed to find one work');
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to update an work');
      }

      const result = await WorkModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, 'success update an work');
    } catch (error) {
      response.error(res, error, 'failed to update an work');
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to remove a thumbnail');
      }

      const result = await WorkModel.findByIdAndDelete(id, {
        new: true,
      });

      if (!result) return response.notFound(res, 'thumbnail not found');

      const { publicId, resourceType } = result.thumbnail;

      await uploader.remove(publicId, resourceType);

      response.success(res, result, 'success remove a work');
    } catch (error) {
      response.error(res, error, 'failed to remove a work');
    }
  },
};
