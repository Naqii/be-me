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

      CreateVideosRequest: {
        title: 'title videos',
        video:
          'example https://res.cloudinary.com/dzfxaqjrp/video/upload/v1746499157/sxby3i5a1ttjwzx9i8od.webp',
        thumbnail:
          'example https://res.cloudinary.com/dzfxaqjrp/image/upload/v1746499157/sxby3i5a1ttjwzx9i8od.webp',
        isShow: true,
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
        type: 'ObjectId',
        isShow: true,
        updated: '2025-01-01',
      },

      CreateTemplateRequest: {
        name: 'Animation',
        description: 'Animation',
        icon: 'https://res.cloudinary.com/dzfxaqjrp/image/upload/v1765531070/ywhci8wzszuxyxhdyvru.webp',
      },
    },
  },
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/api.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
