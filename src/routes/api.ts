import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import aclMiddleware from '../middleware/acl.middleware';
import mediaMiddleware from '../middleware/media.middleware';
import { ROLES } from '../utils/constant';
import mediaController from '../controllers/media.controller';
import imageController from '../controllers/image.controller';
import workController from '../controllers/work.controller';
import assetsController from '../controllers/assets.controller';
import categoryController from '../controllers/category.controller';
import urlController from '../controllers/url.controller';
import {
  brustLimiter,
  dailyLimiter,
  shortenLimiter,
} from '../middleware/rateLimit.middleware';
import { createJob, getJob } from '../controllers/job.controller';
import { downloadJobResult } from '../controllers/download.controller';

const router = express.Router();

//register schema
router.post(
  '/auth/register',
  authController.register
  /*
  #swagger.tags = ['Auth']
  #swagger.requestBody = {
    required: true,
    schema: {$ref: "#/components/schemas/RegisterRequest"}
  }
*/
);
router.post(
  '/auth/login',
  authController.login
  /*
  #swagger.tags = ['Auth']
  #swagger.requestBody = {
    required: true,
    schema: {$ref: "#/components/schemas/LoginRequest"}
  }     
*/
);
router.get(
  '/auth/me',
  authMiddleware,
  authController.me
  /*
  #swagger.tags = ['Auth']
  #swagger.security = [{
    "bearerAuth": [],
  }]
 */
);
router.post(
  '/auth/activation',
  authController.activation
  /*
  #swagger.tags = ['Auth']
  #swagger.requestBody = {
    required: true,
    schema: {$ref: "#/components/schemas/ActivationRequest"}
  }
 */
);
router.post(
  '/auth/activation',
  authController.activation
  /*
  #swagger.tags = ['Auth']
  #swagger.requestBody = {
    required: true,
    schema: {$ref: "#/components/schemas/ActivationRequest"}
  }
 */
);

//media uploader schema
router.post(
  '/media/single-pict',
  [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN]),
    mediaMiddleware.single('file'),
  ],
  mediaController.singlePict
  /*
    #swagger.tags = ['Media']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary"
              }  
            }
          }
        }
      }
    }
  */
);
router.post(
  '/media/single-arch',
  [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN]),
    mediaMiddleware.single('file'),
  ],
  mediaController.uploadArchive
  /*
    #swagger.tags = ['Media']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary"
              }  
            }
          }
        }
      }
    }
  */
);
router.post(
  '/media/upload-vid',
  [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN]),
    mediaMiddleware.single('file'),
  ],
  mediaController.singleVideo
  /*
    #swagger.tags = ['Media']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary"
              }  
            }
          }
        }
      }
    }
  */
);
router.post(
  '/media/multiple-pict',
  [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN]),
    mediaMiddleware.multiple('files'),
  ],
  mediaController.multiplePict
  /*
    #swagger.tags = ['Media']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              files: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary"
                }
              }  
            }
          }
        }
      }
    }
  */
);
router.delete(
  '/media/remove',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  mediaController.remove
  /*
    #swagger.tags = ['Media']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/RemoveMediaRequest"
      }
    }
   */
);

//image schema
router.post(
  '/images',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  imageController.create
  /*
    #swagger.tags = ['Images']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateImageRequest"
      }
    }
   */
);
router.get(
  '/images',
  imageController.findAll
  /*
    #swagger.tags = ['Images']
  */
);
router.get(
  '/images/:id',
  imageController.findOne
  /*
    #swagger.tags = ['Images']
  */
);
router.put(
  '/images/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  imageController.update
  /*
    #swagger.tags = ['Images']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateImageRequest"
      }
    }
   */
);
router.delete(
  '/images/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  imageController.remove
  /*
    #swagger.tags = ['Images']
    #swagger.security = [{
      "bearerAuth": {}
    }]
   */
);

//work schema
router.post(
  '/works',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  workController.create
  /*
    #swagger.tags = ['Work']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateWorkRequest"
      }
    }
   */
);
router.get(
  '/works',
  workController.findAll
  /*
    #swagger.tags = ['Work']
  */
);
router.get(
  '/works/:id',
  workController.findOne
  /*
    #swagger.tags = ['Work']
  */
);
router.put(
  '/works/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  workController.update
  /*
    #swagger.tags = ['Work']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateWorkRequest"
      }
    }
   */
);
router.delete(
  '/works/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  workController.remove
  /*
    #swagger.tags = ['Work']
    #swagger.security = [{
      "bearerAuth": {}
    }]
   */
);

//type schema
router.post(
  '/category',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.create
  /*
    #swagger.tags = ['Category']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateCategoryRequest"
      }
    }
   */
);
router.get(
  '/category',
  categoryController.findAll
  /*
    #swagger.tags = ['Category']
  */
);
router.get(
  '/category/:id',
  categoryController.findOne
  /*
    #swagger.tags = ['Category']
  */
);
router.put(
  '/category/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.update
  /*
    #swagger.tags = ['Category']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateCategoryRequest"
      }
    }
   */
);
router.delete(
  '/category/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.remove
  /*
    #swagger.tags = ['Category']
    #swagger.security = [{
      "bearerAuth": {}
    }]
   */
);

//assets schema
router.post(
  '/assets',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  assetsController.create
  /*
    #swagger.tags = ['Asset']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateAssetRequest"
      }
    }
   */
);
router.get(
  '/assets',
  assetsController.findAll
  /*
    #swagger.tags = ['Asset']
  */
);
router.get(
  '/assets/:id',
  assetsController.findOne
  /*
    #swagger.tags = ['Asset']
  */
);
router.get(
  '/assets/:id/download',
  assetsController.download
  /*
    #swagger.tags = ['Asset']
  */
);
router.put(
  '/assets/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  assetsController.update
  /*
    #swagger.tags = ['Asset']
    #swagger.security = [{
      "bearerAuth": {}
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateAssetRequest"
      }
    }
   */
);
router.delete(
  '/assets/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  assetsController.remove
  /*
    #swagger.tags = ['Asset']
    #swagger.security = [{
      "bearerAuth": {}
    }]
   */
);

router.post(
  '/shorten',
  shortenLimiter,
  urlController.createShortUrl
  /*
  #swagger.tags = ['URLShort']
  #swagger.summary = 'Create short URL'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ShortenUrlRequest" }
      }
    }
  }
  */
);
router.post(
  '/shorten/haqi',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  urlController.createShortUrl
  /*
     #swagger.tags = ['URLShort']
         #swagger.security = [{
      "bearerAuth": {}
    }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/ShortenUrlRequest"
      }
    }
     */
);
router.get(
  '/shorten/all-url',
  urlController.findAll
  /*
    #swagger.tags = ['URLShort']
  */
);

router.post(
  '/jobs',
  // brustLimiter,
  // dailyLimiter,
  createJob
  /*
    #swagger.tags = ['Fetch from Youtube']
  */
);

router.get('/jobs/:id', getJob);

router.get('/download/:id', downloadJobResult);

// router.get(
//   '/download/haqi',
//   [authMiddleware, aclMiddleware([ROLES.ADMIN])],
//   fetchController.downloadMedia
//   /*
//     #swagger.tags = ['Fetch from Youtube']
//     #swagger.security = [{
//       "bearerAuth": {}
//     }]
//   */
// );

export default router;
