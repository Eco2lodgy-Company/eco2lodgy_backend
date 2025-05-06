// routes/users.js

import express from 'express';
import {
    createPost,
    getPosts,
    postById,
    deleteById,
    updatePost
   
    
    
} from '../Controllers/postController.js'; 
import upload from '../midleware/upload.js';
const router = express.Router();

router.get('/', getPosts);
router.post('/',upload.single('image'),createPost);
router.get('/:id', postById);
router.put('/:id', updatePost);
router.delete('/:id',deleteById);

export default router;
