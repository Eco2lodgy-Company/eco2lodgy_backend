// routes/users.js

import express from 'express';
import {
    createPartner
} from '../Controllers/partnerController.js'; 
import upload from '../midleware/upload.js';
const router = express.Router();

// router.get('/users', getUsers);
router.post('/',upload.single('image'), createPartner);
// router.post('/login', login);
// router.get('/:email', getUserByEmail);
// // router.put('/:id', updateUser);
// router.delete('/:email', deleteUserByEmail);

export default router;
