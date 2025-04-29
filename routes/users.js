// routes/users.js

import express from 'express';
import {
//   getUsers,
  createUser,
//   getUserByEmail,
  login,
//   updateUser,
//   deleteUser
} from '../Controllers/usersController.js'; 
  
const router = express.Router();

// router.get('/', getUsers);
router.post('/', createUser);
router.post('/login', login);
// router.get('/UserProfile/:email', getUserByEmail);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

export default router;
