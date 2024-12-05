import express from "express";
import { User } from "../models/user.models.js";
import { userAuth } from "../middlewares/auth.js";
import bcrypt from 'bcrypt';

import {validateEditFilde} from "../utile/validateSingup.js"


const profileRoutes = express.Router();

profileRoutes.get("/profile/view",userAuth,async (req,res) => {

    try {
        const user = req.user

        res.json({
            message: `${user.firstName} profile and other data :`,
            data: user
        })


    } catch (error) {
 
        res.status(500).send(`something want wronge ${error}`)
    }

})



profileRoutes.patch("/profile/edit",userAuth, async (req, res) => {

    try {

        if(!validateEditFilde(req)){
            throw new Error("invalid edit filde request")
        }
    
        const data = req.body;

        if(data?.skills.length > 10){
            throw new Error("skills must be less than 10")
        }

        const loggedUser = req.user
        // const user = await User.findByIdAndUpdate(userId,data,{returnDocument : "after"})

        Object.keys(req.body).forEach((key) => ( loggedUser[key] = data[key]));

        await loggedUser.save();
        res.json({massage: "user Profile Edit successfully",data : loggedUser})
    } catch (error) {
        res.status(400).send("Some Thing want wrong :"+ error);
    }


})



profileRoutes.patch("/profile/password",userAuth, async (req, res) => {
    try {
        const {password} = req.body;
        
        const passwordHash = await bcrypt.hash(password,10);

        const userId = req.user._id

        const user = await User.findByIdAndUpdate(userId,{password: passwordHash},{returnDocument: "after"})

        res.send("Password Updated Successfully"+user);

    } catch (error) {
        res.status(400).send("Some thing want wrong"+error)
    }
})




export default profileRoutes;