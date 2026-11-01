


const mongoose = require("mongoose")




const LessonSchema = new mongoose.Schema({



   course : {

     type : mongoose.Schema.Types.ObjectId ,

     required : true ,

     ref : "Course"

   } ,


   title : {
      
    type : String ,

    trim : true ,

    required : true 

   } ,


   description : {

     type : String ,

     trim : true ,

     default : ""

   },


   order : {

      type : Number ,

      default : 0
     
      // الحقل هنستخدمة بعدين في لوجيك لما نيجي نرتب الدروس  في لوجيك كونتليرر عشان دروس تبقي متربتة تحت بعضة بطريقة منظمة ومرتبة
    } ,

  
    image : {

         url :{
           
            type : String 
         },

         publicId : {
            
            type : String 
         }

    } , 


       pdf : {

         url :{
           
            type : String 
         },

         publicId : {
            
            type : String 
         }

    } ,


      vedio : {
         
      type : String 
      
      
      }





} , 
    
    
    
{timestamps : true}

)


LessonSchema.index({ course : 1  , order : 1 }) // دة فهرس عشان نرتب داتا بيز بطريقة مرتبة بحيث نعرض اول درس تبع اول كورس في اسرع وقت

module.exports = mongoose.model("Lesson" , LessonSchema)

