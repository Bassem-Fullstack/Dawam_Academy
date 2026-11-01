




const mongoose = require("mongoose")


const otpSchema = new mongoose.Schema({


user : {

   type : mongoose.Schema.Types.ObjectId ,
   
   ref : "User" ,

   required : true

},



code : {

 type : String ,

  required : true  

} ,


attempts : {
 
    type : Number ,

    default : 0 , // دة عدد محاولات مستخدم في ادخال كود اوتبي لو دخل كود خلط بيتكب هنا عدد محاولات اوتيب حاول يدخل فيها كود صح ومعرفش

} ,

otpExpire : {

 type : Date ,

 required : true // تاريخ وقت كود بنخزنة وبنستخدمة عشان السيرفر يبدأ يقارن وقت خمس دقايق من تفعيل كود يعني مثلا مستخدم جالة كود الساعة 10:00 بظبط الساعة 10:06 الكود يكون انتهي يبدأ بقي يخزنلك توقيت كود بدأ من ساعة كام لحد ساعة كام

}




} , {timestamps : true}


)



module.exports = mongoose.model("OTP" , otpSchema)


