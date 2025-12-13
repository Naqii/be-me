import { FilterQuery, isValidObjectId } from 'mongoose';
import AssetModel, { assetsDTO, TypeAssets } from '../models/assets.model';
import { IPaginationQuery, IReqUser } from '../utils/interface';
import response from '../utils/response';
import { Response } from 'express';

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body } as TypeAssets;

      const existingByTitle = await AssetModel.findOne({
        title: payload.title,
      });
      if (existingByTitle) {
        return response.error(
          res,
          null,
          'Assets with the same title alredy exists'
        );
      }
      await assetsDTO.validate(payload);
      const result = await AssetModel.create(payload);
      response.success(res, result, 'success to create an asset');
    } catch (error) {
      response.error(res, error, 'failed to create an asset');
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeAssets> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await AssetModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await AssetModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        'success find All Asset'
      );
    } catch (error) {
      response.error(res, error, 'failed to find all Asset');
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed find one asset');
      }

      const result = await AssetModel.findById(id);

      if (!result) {
        return response.notFound(res, 'failed find one asset');
      }

      response.success(res, result, 'success find one asset');
    } catch (error) {
      response.error(res, error, 'failed to find one asset');
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to update an asset');
      }

      const result = await AssetModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, 'success update an asset');
    } catch (error) {
      response.error(res, error, 'failed to update an asset');
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to remove an asset');
      }

      const result = await AssetModel.findByIdAndDelete(id, {
        new: true,
      });

      if (!result) return response.notFound(res, 'asset not found');

      response.success(res, result, 'success remove an asset');
    } catch (error) {
      response.error(res, error, 'failed to remove an asset');
    }
  },
};
