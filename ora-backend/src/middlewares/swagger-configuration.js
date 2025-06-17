const swaggerJsdoc = require('swagger-jsdoc');
const routes = require('../api/routes');

const generateSwaggerPaths = (routes) => {
    const paths = {};
  
    routes.forEach(route => {
      const { path, method, description, expectedHeaders, expectedBody } = route;
      
      if (!paths[path]) {
        paths[path] = {};
      }
  
      paths[path][method.toLowerCase()] = {
        summary: description,
        parameters: [
          ...expectedHeaders.map(header => ({
            name: header,
            in: 'header',
            required: true,
            schema: {
              type: 'string'
            }
          })),
          ...expectedBody.map(body => ({
            name: body,
            in: 'body',
            required: true,
            schema: {
              type: 'string'
            }
          }))
        ],
        responses: {
          200: {
            description: 'Success'
          }
        }
      };
    });

    const beautifulApiRouteBefore = Object.fromEntries(
      Object.entries(paths).map(([key, value]) => [`/api${key}`, value])
    );
    return beautifulApiRouteBefore;
  };

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'ORA API Documentation backend',
          version: '1.0.0',
          description: 'Documentation de l\'API ORA propulsé par NodeJS pour le backend.',
        },
        paths: generateSwaggerPaths(routes),
      },
  apis: []
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
};
