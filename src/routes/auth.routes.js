import express from "express";
import bcrypt from 'bcrypt'
import { validateSignup } from "../utile/validateSingup.js";
import { User } from "../models/user.models.js";

const authRoutes = express.Router();

//signup API :::

authRoutes.post("/signup",async (req,res) => {

    const {firstName,lastName,emailId, password,skills,photoUrl} = req.body

    try {


        validateSignup(req);

        const passwordHash = await bcrypt.hash(password,10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash,
            skills,
            photoUrl,
        });
        await user.save()
        res.send("this is a signup page")
    } catch (error) {
        res.status(400).send(`somthing want wronge ${error}`);
    }
})

authRoutes.post("/login",async (req, res) => {
    
    try {


        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId})

        const salt = bcrypt.genSaltSync(10);
        
        if(!user){
            throw new Error("User is Not vaild");
        }

        const isPasswordVaild = await user.validatePassword(password);
        if(isPasswordVaild){

            const token = await user.getJWT();

            res.cookie("token",token,{expires: new Date(Date.now() + 900000),httpOnly: true});

            res.send(`User is successfully logind =>> ${user.firstName}`)
        }else{
            throw new Error("passsword not currect");
        }

    } catch (error) {
        res.status(400).send(`Login Erro: ${Error.massage}`);
    }
})


authRoutes.post("/logout",async (req, res) => {
    res.cookie("token",null,{expires: new Date(Date.now()),httpOnly : true})
    res.send("successfully Logout ")
})



export default authRoutes;