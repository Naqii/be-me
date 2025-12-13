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
          'example https://res.cloudinary.com/dzfxaqjrp/video/upload/v1746499157/sxby3i5a1ttjwzx9i8od.webp',
        thumbnail:
          'example https://res.cloudinary.com/dzfxaqjrp/image/upload/v1746499157/sxby3i5a1ttjwzx9i8od.webp',
        isShow: true,
      },

      CreateImageRequest: {
        title: 'title images',
        image:
          'example https://res.cloudinary.com/dzfxaqjrp/image/upload/v1746499157/sxby3i5a1ttjwzx9i8od.webp',
        isShow: true,
      },

      CreateWorkRequest: {
        title: 'Finall Project Video',
        thumbnail:
          'https://res.cloudinary.com/dzfxaqjrp/image/upload/v1765185863/fupzcsm2gdtsygavtysb.webp',
        content: 'https://youtu.be/zsXN01GRPGw',
        description:
          'Video ini merupakan cuplikan dari video akhir proyek yang saya kerjakan sewaktu menjadi tim dokumentasi Proyek Pembangunan SPAM Regional WOSUSOKAS Wonogiri',
        isShow: true,
        dateFinished: '2025-01-01',
      },

      CreateAssetRequest: {
        title: 'Minecraft-Damaged-1',
        thumbnail:
          'https://res.cloudinary.com/dzfxaqjrp/image/upload/v1765185863/fupzcsm2gdtsygavtysb.webp',
        asset:
          'https://res.cloudinary.com/dzfxaqjrp/raw/upload/v1765524968/jjrz28rrobsw6gik3blt',
        type: 'ObjectId',
        isShow: true,
        dateFinished: '2025-01-01',
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
