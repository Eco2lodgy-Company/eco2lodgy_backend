// routes/users.js

import express from 'express';
import {
    createMember,
    getMembers,
    memberById,
    deleteById,
    updateMember
    
    
} from '../Controllers/memberController.js'; 
import upload from '../midleware/upload.js';
const router = express.Router();

router.get('/', getMembers);
router.post('/',upload.single('image'),createMember);
router.get('/:id', memberById);
router.put('/:id', updateMember);
router.delete('/:id',deleteById);

export default router;
