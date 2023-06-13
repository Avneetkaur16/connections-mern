import User from '../models/user.js';
import bcrypt from 'bcrypt';


// UPDATE
export const updateUser = async(req, res) => {
    const { id } = req.params;
    const { oldPassword, ...otherData } = req.body;

    try {
        if(req.body.password) {

            // validate the old password first for security reasons
            const user = await User.findById(id);
            const verified = bcrypt.compare(oldPassword, user.password);

            if(!verified) return res.status(403).json({ message: 'Please enter the valid password' });

            const salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, 
            { $set: { ...otherData } }, 
            { new: true }
        );

        const { password, ...data } = updatedUser._doc;

        res.status(200).json(data);
           
    } catch (error) {
        res.status(500).json(error);
        console.log(error)

    }
}


// GET
export const getUser = async(req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        const { password, ...data } = user._doc;
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json(error);
    }

}


// DELETE
export const deleteUser = async(req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User Deleted' })

    } catch (error) {
        res.status(500).json(error)
    }

};

// FOLLOW and UNFOLLOW
export const followUser = async(req, res) => {
    const { id } = req.params;
    const thisUser = req.user.id

    try {

        const user = await User.findById(id);
        const currentUser = await User.findById(thisUser);

        if(user.followers.includes(thisUser) && currentUser.followings.includes(user._id)) {
            await user.updateOne({
                $pull: { followers: thisUser }
            });

            await currentUser.updateOne({
                $pull: { followings: id }
            })

            res.status(200).json({ message: 'User Unfollowed' })

        } else {

            await User.findByIdAndUpdate(id,{
                $push: { followers: thisUser }
            })
        
            await User.findByIdAndUpdate(thisUser, {
                $push: { followings: id }
            })

            res.status(200).json({ message: 'User followed' })
        }

    } catch (error) {
        res.status(500).json(error)
    }

}


// SEARCH USER
export const searchUser = async(req, res) => {
    const { search } = req.body;
    const users = [];

    try {
        const allUsers = await User.find({});

        allUsers.forEach(user => {
            if(user.firstName.toLowerCase().includes(search.toLowerCase()) 
                || user.lastName.toLowerCase().includes(search.toLowerCase())
                || user.username === search) {
                    users.push(user);
                }
        });
        
        res.status(200).json(users);
        
    } catch (error) {
        console.log(error)
    }

}