// routes/users.js

import express from 'express';
import {
    createPartner,
    getPartners
} from '../Controllers/partnerController.js'; 
import upload from '../midleware/upload.js';
const router = express.Router();

router.get('/', getPartners);
router.post('/',upload.single('image'), createPartner);
// router.post('/login', login);
// router.get('/:email', getUserByEmail);
// // router.put('/:id', updateUser);
// router.delete('/:email', deleteUserByEmail);

export default router;
