


const mongoose = require("mongoose")






const quizResult = new mongoose.Schema({



 student : {

   type : mongoose.Schema.Types.ObjectId , 

   ref : "User" , 

   required : true 

 } , 
 
 
 quiz : {

   type : mongoose.Schema.Types.ObjectId , 

   ref : "Quiz" , 

   required : true 

 } , 


 scoreObtained : {

  type : Number ,

  required : true 
 
}, // درجة اللى جابة الطالب


totalScore : {

 type : Number , 
 
 required : true 

}, // مجموع اختبار من كام


status : {

 type : String ,

 enum : ["passed" , "failed"] , 

 required : true 

} // حالة طالب سواء ناجح او راسب


} , {timestamps : true})



module.exports = mongoose.model("QuizResult" , quizResult )

