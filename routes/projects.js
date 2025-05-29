// routes/users.js

import express from 'express';
import {
    createProject,
    getProjects,
    projectById,
    deleteById,
    updateProject
    
} from '../Controllers/projectsController.js'; 
import upload from '../midleware/upload.js';
const router = express.Router();

router.get('/', getProjects);
router.post('/', upload.array('images', 10), createProject);
router.get('/:id', projectById);
router.put('/:id', updateProject);
router.delete('/:id',deleteById);

export default router;
