import { Response } from 'express';
import response from '../utils/response';
import { IPaginationQuery, IReqUser } from '../utils/interface';
import { FilterQuery, isValidObjectId } from 'mongoose';
import uploader from '../utils/uploader';
import CategoryModel, {
  categoryDTO,
  TypeCategory,
} from '../models/category.model';

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body } as TypeCategory;

      const existingByName = await CategoryModel.findOne({
        name: payload.name,
      });
      if (existingByName)
        return response.error(
          res,
          null,
          'Category with the same name already exists'
        );

      await categoryDTO.validate(payload);
      const result = await CategoryModel.create(payload);
      response.success(res, result, 'success to create a Category');
    } catch (error) {
      response.error(res, error, 'failed to create a Category');
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeCategory> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await CategoryModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        'success find All Category'
      );
    } catch (error) {
      response.error(res, error, 'failed to find all Category');
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed find a Category');
      }

      const result = await CategoryModel.findById(id);

      if (!result) {
        return response.notFound(res, 'failed find a Category');
      }

      response.success(res, result, 'success find one Category');
    } catch (error) {
      response.error(res, error, 'failed to find a Category');
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to update a Category');
      }

      const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, 'success update a Category');
    } catch (error) {
      response.error(res, error, 'failed to update a Category');
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to remove a Category');
      }

      const result = await CategoryModel.findByIdAndDelete(id);

      if (!result) return response.notFound(res, 'Category not found');

      const { publicId, resourceType } = result.icon;

      await uploader.remove(publicId, resourceType);

      response.success(res, result, 'success remove a banner');
    } catch (error) {
      response.error(res, error, 'failed to remove a banner');
    }
  },
};
