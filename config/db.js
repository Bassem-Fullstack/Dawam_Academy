


const mongoose = require("mongoose")



const ConnectDB = async () => {


try {

await mongoose.connect(process.env.DB_URL)

console.log("MongoDB connected")

}


catch (err) {

console.log("MongoDB doesn't connectDB")

}


}


module.exports = ConnectDB
