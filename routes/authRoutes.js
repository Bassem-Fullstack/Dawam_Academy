



const router = require("express").Router()


const { RegisterUsers , updateProfilePicture , LoginUser , getUserProfile , RefreshToken , Logout , forgetPassword , verifyOTP , ResetPassword } 

= require("../controllers/authControllers")


const { LoginSchema , registerSchema , forgotPasswordSchema  , verifyOtpSchema , resetPasswordSchema}

= require("../validators/Joi")

const validate = require("../validators/validate")


const { OTPLimitTimer , forgetLimitTimer , loginLimitTimer  }

= require("../middleware/rateLimiters")


const { verifyToken } = require('../middleware/verifyToken');


const upload = require("../config/cloudinary")

/////////////////////////////////////////////////////////////////// 

// 1- تسجيل الدخول والخروج


router.post("/register" , validate(registerSchema),RegisterUsers )

router.post("/login" , loginLimitTimer , validate(LoginSchema) , LoginUser )

router.post("/refresh" , RefreshToken )

router.delete("/logout" , Logout )

///////////////////////////////////////////////////// 

// 2- استعادة كلمة المرور

router.post("/forget-password" , forgetLimitTimer , validate(forgotPasswordSchema) , forgetPassword )

router.post("/verify-otp", OTPLimitTimer, validate(verifyOtpSchema), verifyOTP)

router.post("/reset-password", OTPLimitTimer, validate(resetPasswordSchema), ResetPassword)

/////////////////////////////////////////////////////////////////////////////////

// 3- profile 

router.post("/update-avatar" , verifyToken , upload.single("image") , updateProfilePicture )

router.get('/profile', verifyToken, getUserProfile)




module.exports = router