const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TaskMaster API',
            version: '1.0.0',
            description: 'API documentation for TaskMaster',
        },
    },
    apis: ['./controllers/*.js'], // Archivos donde Swagger buscará comentarios de documentación
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};
