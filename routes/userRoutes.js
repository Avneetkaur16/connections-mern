import express from 'express';
import { deleteUser, followUser,  getUser, searchUser, updateUser } from '../controllers/userControllers.js';
import { verifyFollowReq, verifyToken, verifyUser } from '../utils/verify.js';

const router = express.Router();

// UPDATE A USER
router.put('/:id', verifyUser, updateUser);

// FOLLOW A USER
router.put('/follow/:id', verifyFollowReq, followUser);


// DELETE A USER
router.delete('/:id', verifyUser, deleteUser);

// GET A USER
router.get('/:id', verifyToken, getUser);

// SEARCH USER
router.post('/search', verifyToken, searchUser);



export default router;