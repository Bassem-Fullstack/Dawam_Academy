


const mongoose = require("mongoose")



const userSchema = new mongoose.Schema({


username : {

 type : String ,

 required : true ,

 trim : true 


} ,


email : {

type :String ,

unique : true , 

required : true ,

trim : true ,

lowercase : true

} ,


password : {

type : String ,

required : true ,

select: false ,

trim : true 

} ,



role : {

type : String ,

enum : ["student" , "admin"] ,

default: 'student'

} ,


purchasedCourses : [
 
    {
      
        type : mongoose.Schema.Types.ObjectId ,

        ref : "Course" 

    }


] ,



completedLessons : [

 {

 type : mongoose.Schema.Types.ObjectId ,

 ref : "Lesson"

 }
  

] ,





refreshToken : {

type : String , 

select : false

} , 



avatar : {

  url : {
     
    type : String 
  } ,

  publicId : {
     
    type : String

  }

}




} , {timestamps : true})





module.exports = mongoose.model("User" , userSchema)
