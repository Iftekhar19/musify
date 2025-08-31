import mongoose from "mongoose"


const dbConnect= async () => {
   try {
     await mongoose.connect(process.env.MONGO_URI as string,{
         dbName:"spotify"
     })
     console.log("DB connected successfully")
   } catch (error) {
    console.log(error)
   }
}
export {dbConnect}