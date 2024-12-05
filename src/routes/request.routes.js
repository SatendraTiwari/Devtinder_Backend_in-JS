import express from 'express'
import { userAuth } from '../middlewares/auth.js';
import { ConnectionRequest } from '../models/connectionRequest.models.js';
import { User } from '../models/user.models.js';

const requestRoutes = express.Router();



requestRoutes.post("/request/send/:status/:toUserId",userAuth,async (req,res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status


        // if(fromUserId == toUserId){
        //     throw new Error("You can't send a request to yourself")
        // }

        const allowdedStatus = ['ignored','interested'];
        if(!allowdedStatus.includes(status)){
            throw new Error(`Invalid Status ${status}`);
        }

        const toUserIsValid = await User.findById(toUserId)

        if(!toUserIsValid){
            throw new Error("User not found in your User DateBase")
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ]
        });

        if(existingConnectionRequest){
            throw new Error("allready request are pending")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })  

        // to user data 
        const toUserData = await User.findById(toUserId)

        // from user data save
        const data = await connectionRequest.save();
    
        res.json({
            message : `${req.user.firstName} Your Connection"${status}" request is send to ${toUserData.firstName} `,
            data : data
        })
    } catch (error) {
        res.status(400).json({ message:'something wrong : '+ error.message})
    }

})


requestRoutes.post("/request/review/:status/:requestId",userAuth,async (req,res) => {
   

    try {
        const status = req.params.status;

        const requestId = req.params.requestId;
    
        const loggedUser = req.user;

        const allowedStatus = ["accepted","rejected"];
    
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid Stutes"+status);
        }
    
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedUser._id,
            status: "interested"
        })
    
        connectionRequest.status = status;
    
        const data = await connectionRequest.save()

        res.json({
            message: `Your request is ${status}`,
            data: data,
        })
    } catch (error) {
        res.status(400).send("SomeThing Want Wronge : "+error)   
    }

}) 

export default requestRoutes;
