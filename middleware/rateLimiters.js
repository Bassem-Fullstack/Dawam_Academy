


const rateLimit = require("express-rate-limit") 



const loginLimitTimer = rateLimit({


windowMs : 15 * 60 * 1000, // لو عمل اكتر من 10 محاولات في تسجيل دخول وجية في المرة 11 مش هيقدر يعمل تسجيل دخول تاني مضطر يستني لحد ما يعدي ربع ساعة

limit : 10 , 

message : { message : "Too many login attempts, please try again after 15 minutes" }


})



const forgetLimitTimer = rateLimit({

windowMs : 15 * 60 * 1000 ,

limit : 5 ,

message : { message : "Too many requests, please try again after 15 minutes" }


})


const OTPLimitTimer = rateLimit({

windowMs : 15 * 60 * 1000 ,

limit : 50 ,

message: { message: "Too many verification attempts, please try again after 15 minutes" },

})


module.exports = { OTPLimitTimer , forgetLimitTimer , loginLimitTimer  }