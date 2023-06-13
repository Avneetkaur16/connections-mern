import Post from '../models/post.js'
import User from '../models/user.js';

// CREATE
export const createPost = async(req, res) => {
    const { id } = req.params;
    const { text, image } = req.body;

    try {
        const newPost = new Post({ userId: id, text: text, image: image });
        await newPost.save()
        res.status(200).json(newPost)

    } catch (error) {
        res.status(500).json(error)
    }
}


// GET
export const getPost = async(req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json(error);
    }

}


// GET ALL POSTS OF A USER
export const getTimelinePosts = async(req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        const posts = await Post.find({ userId: user._id });

        const followedPosts = await Promise.all(user.followings.map((following) => { return Post.find({ userId: following }) }));

        res.status(200).json([ posts.reverse(), followedPosts.reverse() ])

    } catch (error) {
        res.status(500).json(error)
    }

}

// GET POSTS OF A PROFILE
export const getProfilePosts = async(req, res) => {
    const { id } = req.params;

    try {
        const posts = await Post.find({ userId: id });

        res.status(200).json(posts.reverse());

    } catch (error) {
        res.status(500).json(error);
    }
}


// UPDATE
export const updatePost = async(req, res) => {
    const { postId } = req.params;
    try {
        const updatedPost = await Post.findByIdAndUpdate(postId,
            { $set: req.body },
            { new: true }   
        );

        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(500).json(error);
    }
}


// DELETE
export const deletePost = async(req, res) => {
    const { postId } = req.params;
    
    try {
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json(error);
    }
}

// LIKE OR UNLIKE
export const likeUnlikePost = async(req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId); 

        if (post.likes.includes(req.user.id)) {

            await post.updateOne({ $pull: { likes: req.user.id } });
            res.status(200).json({ message: 'Post Unliked' })

        } else {
            await post.updateOne({ $push: { likes: req.user.id } });
            res.status(200).json({ message: 'Post Liked' })
        }

    } catch (error) {
        res.status(500).json(error)
    }
}