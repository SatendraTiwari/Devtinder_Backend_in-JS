import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb+srv://satendrasharma1953:mongo8959@cluster0.qkd0i.mongodb.net/devtender")
        console.log(`\n MongoDB connected !! Db HOST: ${connectionInstance.connection.host}`);
    } catch(error){
        console.error("MONGODB CONNECTION",error)
        process.exit(1)
    }
   
}

export default connectDB

// connectDB().then(() => {
//     console.log("connection is done")
// }).catch((arr) => {
//     console.log("database is not connected")
// })

