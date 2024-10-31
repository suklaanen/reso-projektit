// HOXHOXHOX !! 
// auth -reitit ovat ihan ok mallilla, mutta esim item, user, message, taker puuttuu kaikki: Servicet, Modelit ja Routet
//// Niille luotu paikat components -alihakemistoon: endpointteja voi alkaa kirjoittelemaan

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
//const itemRoutes = require('./components/items/itemRoutes');
//const userRoutes = require('./components/users/userRoutes'); 
//const messageRoutes = require('./components/messages/messageRoutes'); 
//const takerRoutes = require('./components/takers/takerRoutes'); 

app.use('/api/auth', authRoutes); 
//app.use('/api/items', itemRoutes);
//app.use('/api/users', userRoutes);
//app.use('/api/messages', messageRoutes);
//app.use('/api/takers', takerRoutes);

app.get('/', (req, res) => {
  res.send('Tervetuloa juureen');
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
