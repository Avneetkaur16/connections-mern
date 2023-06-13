import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();


// CREATE / REGISTER A USER
export const register = async(req, res) => {
    const { username, email, firstName, lastName, password } = req.body;

    try {
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(password, salt);

        const newUser = new User({ username: username, email: email, password: hashed, firstName: firstName, lastName: lastName })
        await newUser.save();

        res.status(200).json({ message: 'User Created. Login to continue' })
        
    } catch (error) {
        res.status(500).json(error)
    }

}


// LOGIN A USER
export const login = async(req, res) => {

    const { username } = req.body

    try {
        const user = await User.findOne({ username: username });
        if (!user) return res.status(404).json({ message: 'User not found' })

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) return res.status(403).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT);

        const { password, ...data } = user._doc

        res.cookie("access_token", token, { httpOnly: true }).status(200).json({ ...data })

    } catch (error) {
        res.status(500).json(error)
    }

}