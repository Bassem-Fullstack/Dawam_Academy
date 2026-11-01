


const mongoose = require("mongoose")




const CourseScheam = new mongoose.Schema({ 


title : {

 type : String ,

 trim : true , 

 required : true , 

 unique : true 

} ,

description : {

type : String ,

trim : true

} ,


image : {
    
    type : String 
} ,


imagePublicId: { 
    
type: String 

}




} , {timestamps : true})




module.exports = mongoose.model("Course" , CourseScheam)