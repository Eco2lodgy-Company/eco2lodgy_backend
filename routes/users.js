// routes/users.js

import express from 'express';
import {
 getUsers,
  createUser,
 getUserByEmail,
  login,
//   updateUser,
deleteUserByEmail
} from '../Controllers/usersController.js'; 
  
const router = express.Router();

router.get('/users', getUsers);
router.post('/', createUser);
router.post('/login', login);
router.get('/email/:email', getUserByEmail);
// router.put('/:id', updateUser);
router.delete('/:email', deleteUserByEmail);

export default router;
