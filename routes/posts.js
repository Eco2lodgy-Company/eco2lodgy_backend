// routes/users.js

import express from 'express';
import {
    createPost,
    getPosts,
    postById,
    deleteById
   
    
    
} from '../Controllers/memberController.js'; 
import upload from '../midleware/upload.js';
const router = express.Router();

router.get('/', getPosts);
router.post('/',upload.single('image'),createPost);
// router.post('/login', login);
router.get('/:id', postById);
// // router.put('/:id', updateUser);
router.delete('/:id',deleteById);

export default router;
