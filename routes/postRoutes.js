import express from 'express';
import { createPost, deletePost, getTimelinePosts, getPost, updatePost, likeUnlikePost, getProfilePosts } from '../controllers/postControllers.js';
import { verifyToken, verifyUser } from '../utils/verify.js';

const router = express.Router();

// CREATE A POST
router.post('/:id', verifyUser, createPost);

// UPDATE A POST
router.put('/:id/:postId', verifyUser, updatePost);

// DELETE A POST
router.delete('/:id/:postId', verifyUser, deletePost);

// GET A POST
router.get('/:postId', verifyToken, getPost);

// GET ALL THE POSTS OF USERS
router.get('/timeline/:id', verifyUser, getTimelinePosts);

// GET PROFILE POSTS
router.get('/profile/:id', verifyToken, getProfilePosts);

// LIKE OR UNLIKE A POST
router.put('/like/:id/:postId',verifyUser, likeUnlikePost);

export default router;