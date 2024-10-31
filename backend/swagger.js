const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
    './components/auth/authRoutes.js', 
];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./index.js'); 
});