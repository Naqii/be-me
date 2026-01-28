import { Request, Response } from 'express';
import response from '../utils/response';
import { isValidUrl } from '../utils/validatorUrl';
import UrlModel, { TypeUrl, urlDTO } from '../models/url.model';
import { BASE_URL } from '../utils/env';
import { error } from 'console';
import { formatInputAlias } from '../utils/formatAlias';
import { IPaginationQuery, IReqUser } from '../utils/interface';
import { FilterQuery } from 'mongoose';

export default {
  async createShortUrl(req: Request, res: Response) {
    try {
      const { originalUrl, customAlias } = req.body;

      if (!isValidUrl(originalUrl)) {
        response.error(res, error, 'Invalid Url');
        return;
      }

      await urlDTO.validate(req.body);

      const formattedAlias = formatInputAlias(customAlias);

      const exists = await UrlModel.findOne({ customAlias: formattedAlias });
      const reserved = ['server', 'url', 'api-docs'];
      if (reserved.includes(customAlias)) {
        return res.sendStatus(404);
      }

      if (exists) {
        response.error(res, error, 'Alias alredy taken');
        return;
      }

      const newUrl = `${BASE_URL}/${formattedAlias}`;
      const urlData = {
        ...req.body,
        customAlias: formattedAlias,
        newUrl,
      };

      const result = await UrlModel.create(urlData);
      response.success(res, result, 'Success to create new Url');
    } catch (error) {
      response.error(res, error, 'Failed to create new Url');
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeUrl> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await UrlModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await UrlModel.countDocuments(query);

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

  async redirectOriginalUrl(req: Request, res: Response) {
    try {
      const { customAlias } = req.params;

      // Find the entry by customAlias
      const alias = await UrlModel.findOne({ customAlias });
      if (!alias) {
        response.error(res, error, 'customAlias not found');
        return;
      }

      // Get the original URL
      const originalUrl = alias.originalUrl;
      if (typeof originalUrl === 'string') {
        res.redirect(originalUrl);
      } else {
        res.status(404).json({ error: 'URL not found' });
      }
    } catch (error) {
      response.error(res, error, 'Failed to get original Url');
    }
  },
};
