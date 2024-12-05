import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true, 

    },
    lastName : {
        type : String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not valida Email")
            }
        }

    },
    password : {
        type: String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password are not stronge");
            }
        }
    },
    age : {
        type: Number,
        min : 18
    },
    gender : {
        type: String,
        validate(value){
            if(!["male","famale","other"].includes(value)){
                throw new Error("gender are not validate");
            }
        }
    },
    photoUrl: {
        type: String,
    },
    about : {
        type : String,
        default: "Hello! hii satendra sharma",
    },
    skills: {
        type : [String],
    }
},{
    timestamps: true
})
userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({_id: user?._id},"satendra@44456",{
        expiresIn : "1d",
    })

    return token;
}



userSchema.methods.validatePassword = async function (inputPassword) {
    const user = this;
    const passworHash = user.password
    const passwordValid = await bcrypt.compare(inputPassword,passworHash);

    return passwordValid;
}


export const User = mongoose.model("User",userSchema);
