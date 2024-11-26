const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Attendance Records API',
      version: '1.0.0',
      description: 'API for managing attendance records, laboratories, and user accounts',
      contact: {
        name: 'Alejandro López Vargas',
        email: 'e.alvargas@do.ugr.es',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api', 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
