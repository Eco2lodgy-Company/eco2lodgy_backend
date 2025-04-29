// routes/users.js

import express from 'express';
import {
    createMember,
    getMembers,
    memberById,
    deleteById
    
    
} from '../Controllers/memberController.js'; 
import upload from '../midleware/upload.js';
const router = express.Router();

router.get('/', getMembers);
router.post('/',upload.single('image'),createMember);
// router.post('/login', login);
router.get('/:id', memberById);
// // router.put('/:id', updateUser);
router.delete('/:id',deleteById);

export default router;
