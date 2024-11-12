const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') }); 
const cors = require('cors');
const app = express();
const port = 8080;
//const swaggerUi = require('swagger-ui-express');
//const swaggerFile = require('./swagger_output.json');

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Reititykset
const authRoutes = require('./components/auth/authRoutes'); 
const itemRoutes = require('./components/items/itemRoutes');

app.use('/api/auth', authRoutes); 
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.send('Tervetuloa juureen');
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});