




const mongoose = require("mongoose")



const quizSchema = new mongoose.Schema({


 title : {

  type : String ,

   required : true 


 } , // دة عنوان الأختبار او اسم الأختبار


 course : {

  type : mongoose.Schema.Types.ObjectId , 

  ref : "Course" , 

  required : true 

 } , 
  

 lesson : {

  type : mongoose.Schema.Types.ObjectId , 

  ref : "Lesson" , 

  required : true 

 } , 


 questions : [

    {

  questionText : {

        type : String ,
        
        required : true 

  } , // دة الأسئلة نفسها
  

  correctAnswer: { type: String, required: true } , // اجابات صحيحة
  
   options : [ {type : String , required : true} ] , // الاختيارات اللى هتحط فيها الاجابات 
   
    
    score : {
         
        type : Number ,
        
        default : 1  

     } ,  // درجة السؤال والسؤال من كام درجة

  } ] , 

 
 passingScore : { type : Number , default : 50 } // نسبة نجاح من 50% فقط


} , {timestamps : true})



module.exports = mongoose.model("Quiz" , quizSchema)



