



const User = require("../models/User")

const bcryptjs = require("bcryptjs")

const jwt = require("jsonwebtoken")

const OTP = require("../models/OTP")

const SendEmail = require("../utils/sendEmail")

const cloudinary = require("cloudinary").v2

const isProd = process.env.NODE_ENV === "production"

// طريقة دي احلي طريقة موقع لو لوكيل هوست محلي هيشتغل معاة عادي ويبعت توكين من كوكيز عادي ولو سيرفر مش محلي عملتلوة استضافة هيشتغل برضو عادي وتقدر تباصي توكين لفروند اند عادي حتي لو هما مش نفس لينك ومش نفس دومين

const refreshCookieOptions = {

httpOnly : true ,

secure : isProd , // دة بيتغير تلقائي على حسب بيئة انت شغال فيها سواء رفعت مشروع على فيرسيل او مرفعتوش هو كود دة هيقدر يتعامل مع ريفريش توكين وارسالها لما موقع تاني يطلبها 

sameSite : isProd ? "none" : "lax" , // lax لاكس دي هي يسمح ارسال طلبات توكين لكن في حالات معينة مش دايما لكن نان بيسمح ارسال توكين لاي طلب من برة مش لازم يكونوا نفس موقع بيكلموة

maxAge : 10 * 24 * 60 * 60 * 1000


// localhost:3000  →  localhost:5000 دة لاكس مش هيهتم بالبورت وهيبعت طلب عادي لانهم نفس الاسم لينك لكن مش نفس بورت

// https://myapp.com → https://other-site.com lax هنا مش هيتبعت عشان خاطر مش نفس الاسم سايت فمستيحل يرسل لك ريفريش توكين

// https://myapp.com → https://other-site.com none production هيسمح يبعت ريفريش توكين لان انت قايلوة هنا ان فروند اند بيطلب ريفريش توكين من باك اند مش نفس سايت ولا نفس بورت فالبتالي بيسمح اي طلب جاي من برة عشان تبعتلوة ريفريش توكين


}


////////////////////////////////////////////////////////////////////// 


// ### 1- RegisterUsers

const RegisterUsers = async(req , res) => {


const { username , email , password } = req.body 


const existUser = await User.findOne({email})


if(existUser) {

return res.status(409).json({ message : "Email already exists" })

}


const hashPassword = await bcryptjs.hash(password , 10)


const addUser = await User.create({

username ,

email , 

password : hashPassword

})



res.status(201).json({

 message : "User registered successfully" ,

 user : {

   id : addUser._id ,

   username : addUser.username ,

   email : addUser.email ,

   role : addUser.role ,
 
 }


})

}



//////////////////////////////////////////////////////////////////////////////////////



// ## 2- LoginUser 



 const LoginUser = async (req , res) => {

 
const { email , password } = req.body 


const getUser = await User.findOne({email}).select("+password")


if(!getUser) {

return res.status(401).json({ message : "Invalid email or password" })

}


const isMatch = await bcryptjs.compare( password , getUser.password )


if(!isMatch) {

return res.status(401).json({ message : "Invalid email or password" })


}



const token = jwt.sign(

{
  
  userID : getUser._id ,

  role : getUser.role 

} ,


process.env.ACCESS_TOKEN_SECRET ,


{

 expiresIn : "15d"

})





const refreshToken = jwt.sign (

  {userID : getUser._id} ,

  process.env.REFRESH_TOKEN_SECRET ,

  {expiresIn : "15d"}
 
)


getUser.refreshToken = refreshToken 

await getUser.save()



res.cookie("refreshToken" , refreshToken , refreshCookieOptions) 

// الطريقة دي حلوة تكتب اعدادات كوكيز في متغير لوحدة برة دوال ويبقي جلوبال وتقدر تستخدموة في لوجين ولوج اويت بدل ما تكتب نفس اعدادادت في نفس فونشين


return res.status(200).json({

  message: "Login successfully",

  accessToken : token , 
  
  user : {
    
    id : getUser._id ,
     
    username : getUser.username ,

    email : getUser.email ,
 
    role : getUser.role

  }

})


}



////////////////////////////////////////////////////////////////////////////////////////////////////////


// ### 3- refreshToken 



const RefreshToken = async( req , res ) => {


const token = req.cookies.refreshToken 

if(!token) {

return res.status(401).json({ message : "No refresh token" })

}

const decode = jwt.verify(token , process.env.REFRESH_TOKEN_SECRET)

// بنتأكد من ريفريش توكين ان هو نفس ريفريش توكين متخزن عندنا لو مش هو هو نفس توكين بنرمي ايرورر للمستخدم ايرور اساسي 401 اللى عملناه في ملف رئيسي ابلكشين وكمان لو بنتأكد من الايدي لو مش نفس مستخدم الايدي او مش نفس توكين بنرمي ايرورر على طول في وش مستخدم

// احنا مستخدمين سيلكيت دة عشان لما نيجي نبعت رد للفروند اند منبعتش ريفريش توكين في الرد والطلب وبنستخدموة وقت لزوم فقط لو احنا احتجناة عشان الأمان

const getUser = await User.findById(decode.userID).select("+refreshToken")

if(!getUser || getUser.refreshToken !== token) {

return res.status(401).json({ message : "Invalid refresh token" })

// طبعا بنقارن ريفريش توكين متخزن في كوكيز بريفريش توكين متخزن عندنا في داتا بيز لو مش نفس توكين بنرمي ايرور ومش بنجدد الاكسيس توكين في حالة لو قيمة ريفريش توكين مش متخزنة في كوكيز مش نفس قيمة 

// !getUser استخدمتة هنا في لو مستخدم مش موجود عندي في داتا بيز ممكن يكون مستحتوة من ديكومنت من داتا بيز او ممكن عامل لوج اويت وخرج او اياكان هي مجرد حماية اضافية مش اكتر بنمنع ان ميجددش اكسيس توكين في حالة لو مستخدم مش متسجل عندنا في داتا بيز اصلا فقط

}


const accessToken = jwt.sign(

  { userID : getUser._id , role : getUser.role } ,

  process.env.ACCESS_TOKEN_SECRET ,

  {expiresIn : "15d"}

)

res.status(200).json({ accessToken })


}





////////////////////////////////////////////////////////////////////////////////


// ### 4- Logout 



const Logout = async( req , res ) => {

const token = req.cookies.refreshToken


if(token) {

 await User.updateOne({ refreshToken : token } , {refreshToken : null})

//  ابتيديت وان خاصية في مونجوس بتسمحلك بتعديل قيمة واحدة فقط وطبعا انا حدثت ريفريش توكين وخليتوة نال قيمتة مش معرفة

}


res.clearCookie("refreshToken" , refreshCookieOptions) // بمسح توكين من كوكيز بعد ما ممسحتوة من داتا بيز بروح امسحوة من كوكيز برضو


return res.status(200).json({ message : "Logged out successfully"})

// كدة تسجيل خروج نجح

}


///////////////////////////////////////////////////////////////////////////////////////

// ### OTP ****

// 1-forgetPassword  

 
const forgetPassword = async( req , res ) => {


  const {email} = req.body

 if(!email) {

  return res.status(403).json({ message : "Email is required"})

 }



 const getUser = await User.findOne({ email }) 

if(!getUser){

return res.status(403).json({ message : "User doesn't exist"})

}


if(getUser) {

 await OTP.deleteMany({user : getUser._id}) // بنحدث بيانات اوتيب الكود وتاريخ انشاءة وعدد محاولات مستخدم فهو بيصفر القديم ويخزن جديد في حالة لو مستخدم كتب كود خلط واتبعتلوة كود تاني من جديد ساعتها كود خلط بيتحذف ويحل محلة كود جديد

}




const otp = Math.floor(10000 + Math.random() * 90000).toString()

console.log("OTP (dev only):", otp)    // ← هنا


// 1. Math.random()

// بتولّد رقم عشوائي كسر بين 0 (معانا) و 1 (مش معانا).

// أصغر قيمة ممتازة: 0

// أكبر قيمة ممتازة: 0.99999...




// 2. Math.random() * 90000بنضرب الناتج في 90000 عشان نكبر النطاق:أصغر قيمة: $0 \times 90000 = \mathbf{0}$أكبر قيمة: $0.99999 \times 90000 = \mathbf{89999.999...}$



// 3. 10000 + Math.random() * 90000بنجمع 10000 علشان نزق الرقم بحيث ميكونش فيه أقل من 5 أرقام:أصغر قيمة: $10000 + 0 = \mathbf{10000}$أكبر قيمة: $10000 + 89999.999 = \mathbf{99999.999...}$


// 4. Math.floor(...)بتعمل تقريب للأسفل (تتخلص من الكسر العشرية)، مش تقريب للأقرب (يعني بتطير أي أرقام بعد العلامة عشريّة بدون زيادة):لو الرقم 10000.8 بيرجع $\mathbf{10000}$لو الرقم 99999.9 بيرجع $\mathbf{99999}$

// 5. .toString() الحفاظ على الصفر اللي على الشمال (Leading Zeros) لو نوعه Number: بلغة JavaScript والداتابيز الرقم ده هيتحول أوتوماتيك لـ 4921 (4 أرقام بس مش 5) لأن الأصفار على الشمال ملهاش قيمة في الرياضيات.


await OTP.create({

user : getUser._id ,

code : otp ,

otpExpire : Date.now() + 5 * 60 * 1000


})




await SendEmail (

  getUser.email , 

  "Reset Your Password" ,

`<h2>Your reset code is: <span style="color:#1e3a8a;font-size:20px;letter-spacing:6px;">${otp}</span></h2><p>This code expires in 5 minutes.</p>`
)


return res.status(200).json({ message : "Code sent to your email"})


}



//////////////////////////////////////////////////////////////////////////////


 // 2-**** verify OTP 


  const verifyOTP = async( req , res ) => {
  
   const { email , code } = req.body  
  
    
   const getUser = await User.findOne({ email })
    
   if(!getUser) {

    return res.status(400).json({ message : "user is not found , please login" })

   }
      
   
   const CheckUserOTP = await OTP.findOne({ user : getUser._id })
    

 if(!CheckUserOTP || CheckUserOTP.otpExpire < Date.now() || CheckUserOTP.attempts >=5 ) 
    
  {
    
   return res.status(400).json({ message : "Invalid or expired code" }) 

  }

//  بقولوة لو مستخدم دة الايدي دة بتاعة مش متخزن في داتا بيز بتاع اوتيبي أو لو الوقت عدي يعني وقت متخزن في اوتيبي اقل من الوقت حالي أو عدد محاولات اكتر من او يساوي خمس محاولات وقولوة فشل تجديد الكود 



if (CheckUserOTP.code !== code) {

  CheckUserOTP.attempts +=1 // زودلوة محاولة كمان لو هو اول مرة يدخل كود غلط لحد ما يوصل لخامس محاولة ونقولوة تعالي خد كود جديد بس بعد ربع ساعة وارميلي ايرور دة ان كود خطأ او وقتة خلص
 
  await CheckUserOTP.save() 

  return res.status(400).json({ message : "Invalid or expired code" }) 

}



return res.status(200).json({ message : "Code is succesfully" })

}

  
//////////////////////////////////////////////////////////////////////////////


 // 3-**** Reset Password




  const ResetPassword = async( req , res ) => {
  
   const { email , code , password , confirmPassword } = req.body  
  
    
   const getUser = await User.findOne({ email })
    
   if(!getUser) {

    return res.status(400).json({ message : "user is not found , please login" })

   }
      
   
  const CheckUserOTP = await OTP.findOne({ user : getUser._id })
    

 if(!CheckUserOTP || CheckUserOTP.otpExpire < Date.now() || CheckUserOTP.attempts >=5 ) 
    
  {
    
   return res.status(400).json({ message : "Invalid or expired code" }) 

  }

//  بقولوة لو مستخدم دة الايدي دة بتاعة مش متخزن في داتا بيز بتاع اوتيبي أو لو الوقت عدي يعني وقت متخزن في اوتيبي اقل من الوقت حالي أو عدد محاولات اكتر من او يساوي خمس محاولات وقولوة فشل تجديد الكود 



if (CheckUserOTP.code !== code) {

  CheckUserOTP.attempts +=1 // زودلوة محاولة كمان لو هو اول مرة يدخل كود غلط لحد ما يوصل لخامس محاولة ونقولوة تعالي خد كود جديد بس بعد ربع ساعة وارميلي ايرور دة ان كود خطأ او وقتة خلص
 
  await CheckUserOTP.save() 

  return res.status(400).json({ message : "Invalid or expired code" }) 

}


const hashPassword = await bcryptjs.hash(password , 10) 


getUser.password = hashPassword 

getUser.refreshToken = null 


await getUser.save()


return res.status(200).json({ message : "Password updated successfully" })

}




////////////////////////////////////////////////////////////////////////////////////////////////////



// ### getUserProfile


const getUserProfile = async (req, res) => {

    const userId = req.user.userID; 

    const user = await User.findById(userId)
      .select("-password") // بنشيل الباسورد عشان الأمان

      .populate("purchasedCourses"); // بنجيب تفاصيل الكورسات اللي اشتراها

    if (!user) {
      return res.status(404).json({ success: false, message: "user not found" });
    }



    return res.status(200).json({
      
      success: true,

      user

    })
  }


//////////////////////////////////////////////////////////////////////////////////////


// ## updateProfilePicture



  const updateProfilePicture = async ( req , res ) => {

   
    const userId = req.user.userID 

    if (!req.file) {

      return res.status(400).json({ success: false, message: " you must choose picture " })

    }

  
    const getUser = await User.findById(userId) 


 if (!getUser) {

    return res.status(404).json({ success: false, message: "user not found" })

    }

   
    let ImageUrl = ""

    let publicId = ""

   if(req.file) {

   
   if(getUser.avatar && getUser.avatar.publicId) {

   await cloudinary.uploader.destroy(getUser.avatar.publicId) 

   }
   
  ImageUrl = req.file.path 

  publicId = req.file.filename
   
   
   getUser.avatar = {
     
    url :  ImageUrl ,

    publicId : publicId

   } 

  }
   
  await getUser.save()
  
 return res.status(200).json({

      success: true,

      message: "the Image has updated successfully",

      user: getUser

    })

  }




  module.exports = { RegisterUsers , LoginUser , updateProfilePicture , getUserProfile , RefreshToken , Logout , forgetPassword , verifyOTP , ResetPassword }







