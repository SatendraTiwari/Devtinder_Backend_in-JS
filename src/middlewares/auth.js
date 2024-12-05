import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"


const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        
        if(!token){
            throw new Error("Token is not avaliable")
        }
    
        const decodeDate = jwt.verify(token,"satendra@44456")
    
        const {_id} = decodeDate;
        const user = await User.findById(_id);

    
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("something wnat wronge in AUTH.middleware"+ error.message)
    }
}

export {    
    userAuth
};