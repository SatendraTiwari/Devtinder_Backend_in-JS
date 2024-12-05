import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.models.js";
import { User } from "../models/user.models.js";

const userRoutes = express.Router();


const saveData = ["firstName","lastName"];
const SAVE_FEED = "-emailId -password -createdAt -updatedAt -__v"


userRoutes.get("/user/requests/received",userAuth,async (req, res) => {

    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
        toUserId: loggedUser._id,
        status: "interested"
    }).populate("fromUserId",saveData) //"-firstName"not consider this filde

    const data = connectionRequest.map((row) => row.fromUserId)

    res.json({
        message: `${loggedUser.firstName} Your Request from User `,
        data: data,
    })
})


userRoutes.get("/user/connection",userAuth,async (req, res) => {
    try {

        const loggedUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedUser._id, status: "accepted"},
                {fromUserId: loggedUser._id, status: "accepted"},
            ]
        }).populate("fromUserId",saveData).populate("toUserId",saveData)

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({
            message: `${loggedUser.firstName} Your connection : `,
            data: data
        })

    } catch (error) {
        res.status(400).send("somthing went wrong"+error)
    }
})


userRoutes.get("/user/feed",userAuth,async (req, res) => {
    try {
        const loggedUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedUser._id},
                {toUserId: loggedUser._id}
            ]
        })

        const hidingUser = new Set();

        connectionRequest.forEach((req) => {
            hidingUser.add(req.fromUserId._id);
            hidingUser.add(req.toUserId._id);
        })

        const users = await User.find({
            $and: [
                {_id : {$nin: Array.from(hidingUser)}},
                {_id : {$ne : loggedUser._id}}
            ]
        }).select(SAVE_FEED)

            res.json({
                message : `${loggedUser.firstName} Your User Suggetion Feed`,
                data : user,
            })
            

    } catch (error) {
        res.status(400).send("Some thing went wrong"+error);
    }
})

export default userRoutes;