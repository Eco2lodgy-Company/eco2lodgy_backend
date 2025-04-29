// routes/users.js

import express from 'express';
import {
    createPartner,
    getPartners,
    partnerById,
    deleteById
} from '../Controllers/partnerController.js'; 
import upload from '../midleware/upload.js';
const router = express.Router();

router.get('/', getPartners);
router.post('/',upload.single('image'), createPartner);
// router.post('/login', login);
router.get('/:id', partnerById);
// // router.put('/:id', updateUser);
router.delete('/:id',deleteById);

export default router;
