import express from "express";
import connectDB from "./config/database.js";
import {User} from "./models/user.models.js"
import {validateSignup} from './utile/validateSingup.js'
import bcrypt  from 'bcrypt';
import cookieParser from "cookie-parser";
import { userAuth } from "./middlewares/auth.js"
import profileRoutes from "./routes/profile.routes.js";
import authRoutes from "./routes/auth.routes.js";
import requestRoutes from "./routes/request.routes.js"
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// router 

app.use("/authRoutes",authRoutes);
app.use("/profileRoutes",profileRoutes);
app.use("/requestRoutes",requestRoutes);
app.use("/userRoutes",userRoutes);



app.get("/feed", async (req, res) => {
    const userEmail = req.body.emailId
    

    try {
        const user = await User.find({});

        if(user.length === 0){
            res.status(404).send("User are not Find");
        }else{
            res.send(user);
        }
    } catch (error) {
        res.status(500).send("somthing want wronge");
    }
})

app.delete("/userDelete",userAuth, async (req,res) => {

    try {
        const userId = req.user._id
        // const user = await User.deleteMany({emailId : userEmail})
        const user = await User.findByIdAndDelete({_id : userId}).exec();

        res.send("user is deleted");
        
    } catch (error) {
        res.status(500).send("something wnat wronge");
    }
})


connectDB().then(() => {

    app.listen(3000, () => {
        console.log("server live on port 3000...")
    })
    console.log("connection is done")
}).catch((arr) => {
    console.log("database is not connected")
})


