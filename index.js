import express from 'express';
//import cors from 'cors';
const app = express();
const PORT = 3008;

// // Middleware pour gérer les CORS
// app.use(cors({
//   origin: 'http://localhost:8080', 
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Middleware pour comprendre le JSON
app.use(express.json());

import usersRoutes from './routes/users.js';
import partnersRoutes from './routes/partners.js';



app.use('/api/users', usersRoutes);
app.use('/api/partners', partnersRoutes);


// Démarrage du serveur 
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
