import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: 'v0.0.1',
    title: 'Dokumentasi API ME',
    description: 'Dokumentasi API My Portofolio',
  },

  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Local Server',
    },
    {
      url: 'https://be-me.vercel.app/api',
      description: 'Deploy Server',
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    schemas: {
      LoginRequest: {
        identifier: 'admin',
        password: 'AdminHaqi123',
      },

      RegisterRequest: {
        fullName: 'member2025',
        username: 'member2025',
        email: 'member2025@yopmail.com',
        password: 'Member2025!',
        confirmPassword: 'Member2025!',
      },

      ActivationRequest: {
        code: 'abcrandom',
      },

      RemoveMediaRequest: {
        public_id: '',
        resource_type: 'image/video/raw',
      },

      CreateImageRequest: {
        title: 'title images',
        isShow: true,
        image: {
          url: '',
          publicId: '',
          resourceType: 'image',
        },
      },

      CreateWorkRequest: {
        title: 'Finall Project Video',
        thumbnail: {
          url: '',
          publicId: '',
          resourceType: 'image',
        },
        content: 'https://youtu.be/zsXN01GRPGw',
        description:
          'Video ini merupakan cuplikan dari video akhir proyek yang saya kerjakan sewaktu menjadi tim dokumentasi Proyek Pembangunan SPAM Regional WOSUSOKAS Wonogiri',
        isShow: true,
        dateFinished: '2025-01-01',
      },

      CreateAssetRequest: {
        title: 'Minecraft-Damaged-1',
        category: 'ObjectId',
        isShow: true,
        thumbnail: {
          url: '',
          publicId: '',
          resourceType: 'image',
        },
        asset: {
          url: '',
          publicId: '',
          resourceType: 'raw',
        },
        updated: '2025-01-01',
      },

      CreateCategoryRequest: {
        name: 'Animation',
        description: 'Animation',
        icon: {
          url: '',
          publicId: '',
          resourceType: 'image',
        },
      },

      ShortenUrlRequest: {
        originalUrl: 'https://contohurlpanjang/dowo/banget',
        customAlias: 'url pendek',
      },
    },
  },
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/api.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
