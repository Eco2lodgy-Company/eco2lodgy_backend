import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';

import cors from 'cors';
const app = express();
const PORT = 3008;

// Lire les fichiers du certificat
const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/alphatek.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/alphatek.fr/fullchain.pem'),
  };
  
app.use('/uploads', express.static(path.resolve('uploads')));

// Middleware pour gérer les CORS
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour comprendre le JSON
app.use(express.json());

import usersRoutes from './routes/users.js';
import partnersRoutes from './routes/partners.js';
import projectsRoutes from './routes/projects.js';
import membersRoutes from './routes/members.js';
import postsRoutes from './routes/posts.js';



app.use('/api/users', usersRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/posts', postsRoutes);

// Démarrage du serveur 
https.createServer(sslOptions, app).listen(3008, () => {
    console.log('Serveur HTTPS en écoute sur https://localhost:3008');
  });
