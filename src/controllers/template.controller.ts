import { Response } from 'express';
import response from '../utils/response';
import { IPaginationQuery, IReqUser } from '../utils/interface';
import TemplateModel, {
  templateDTO,
  TypeTemplate,
} from '../models/template.model';
import { FilterQuery, isValidObjectId } from 'mongoose';
import uploader from '../utils/uploader';

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body } as TypeTemplate;

      const existingByName = await TemplateModel.findOne({
        name: payload.name,
      });
      if (existingByName)
        return response.error(
          res,
          null,
          'Template with the same name already exists'
        );

      await templateDTO.validate(payload);
      const result = await TemplateModel.create(payload);
      response.success(res, result, 'success to create a template');
    } catch (error) {
      response.error(res, error, 'failed to create a template');
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeTemplate> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await TemplateModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await TemplateModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        'success find All template'
      );
    } catch (error) {
      response.error(res, error, 'failed to find all template');
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed find a template');
      }

      const result = await TemplateModel.findById(id);

      if (!result) {
        return response.notFound(res, 'failed find a template');
      }

      response.success(res, result, 'success find one template');
    } catch (error) {
      response.error(res, error, 'failed to find a template');
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to update a template');
      }

      const result = await TemplateModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, 'success update a template');
    } catch (error) {
      response.error(res, error, 'failed to update a template');
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, 'failed to remove a template');
      }

      const result = await TemplateModel.findByIdAndDelete(id);

      if (!result) return response.notFound(res, 'template not found');

      const { publicId, resourceType } = result.icon;

      await uploader.remove(publicId, resourceType);

      response.success(res, result, 'success remove a banner');
    } catch (error) {
      response.error(res, error, 'failed to remove a banner');
    }
  },
};
