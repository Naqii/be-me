import express from 'express';
import urlController from '../controllers/url.controller';

const url = express.Router();

url.get(
  '/:customAlias',
  urlController.redirectOriginalUrl /*
    #swagger.tags = ['URLShort']
  */
);

export default url;
