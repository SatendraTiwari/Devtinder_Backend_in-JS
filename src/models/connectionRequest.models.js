import { ClientEncryption } from "mongodb";
import mongoose from "mongoose";
const connectionRequestschema = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values : ['ignored' , 'interested', 'rejected', 'accepted'],
            message : `{VALUE} IS NOT CORRECT`,
        },
    },
},{ timestamps: true})

connectionRequestschema.index({fromUserId: 1, toUserId: 1 })

connectionRequestschema.pre("save",function (next) {
    const connectionRequest = this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can't send a connection request to yourself")
    }

    next()
})




export const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestschema);
