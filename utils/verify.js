import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token

    // no token found
    if(!token) return res.status(403).json({ message: 'Unauthenticated' });

    // verify token
    jwt.verify(token, process.env.JWT, (error, data) => {
        if (error) return res.status(403).json({ message: 'Invalid Token' });

        req.user = data;
        next();
    })

}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.params.id === req.user.id) {
            next()
        } else {
            res.status(403).json({ message: 'You are not authorized' })
        }
    })
}

export const verifyFollowReq = (req, res, next) => {
    const { id } = req.params;

    verifyToken(req, res, () => {
        if(req.user.id !== id) {
            next();
        } else {
            res.status(403).json({ message: 'You cannot follow/unfollow yourself' })
        }
    })
}