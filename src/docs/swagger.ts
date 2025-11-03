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
        fileUrl: '',
      },

      CreateVideosRequest: {
        title: 'title videos',
        video:
          'example https://res.cloudinary.com/dzfxaqjrp/image/upload/v1746499157/sxby3i5a1ttjwzx9i8od.webp',
        isShow: true,
      },

      CreateImageRequest: {
        title: 'title images',
        image:
          'example https://res.cloudinary.com/dzfxaqjrp/image/upload/v1746499157/sxby3i5a1ttjwzx9i8od.webp',
        isShow: true,
      },
    },
  },
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/api.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
