


const joi = require("joi")



const registerSchema = joi.object({

username : joi.string().required().min(3).max(35).trim().messages({

"string.empty" : "Username must not be empty" ,

"any.required" : "Username is required" ,

"string.min": "Username must be at least 3 characters",


}),


email :joi.string().email().required().trim().lowercase().messages({


 "string.empty" : "Email must not be epmty" ,
 
 "any.required" : "Email is required" ,

"string.email": "Please enter a valid email address",

}) ,


password : joi.string().required().trim().pattern(new RegExp(("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")))

.messages({

"string.empty" : "Password must not be empty" ,

"string.pattern.base": "Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters (@$!%*?&)" ,

"any.required" : "Password is required" 

})


})


/////////////////////////////////////////////////////////////////////////////////////////////// 


const LoginSchema = joi.object({


email :joi.string().email().required().trim().lowercase().messages({


 "string.empty" : "Email must not be epmty" ,
 
 "any.required" : "Email is required" ,

 "string.email": "Please enter a valid email address",

}) ,


password : joi.string().required().trim().pattern(new RegExp(("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")))

.messages({

"string.empty" : "Password must not be empty" ,

"string.pattern.base": "Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters (@$!%*?&)" ,

"any.required" : "Password is required" 

})


})


//////////////////////////////////////////////////////////////////////////////////////////// 


const forgotPasswordSchema = joi.object({

  email: joi.string().trim().lowercase().email().required().messages({

    "string.empty": "Email must not be empty",

    "string.email": "Please enter a valid email address",

    "any.required": "Email is required",

  }),

})




/////////////////////////////////////////////////////////////////////////////////////// 


const otpField = joi.string()

  .length(5)

  .pattern(/^\d+$/) // يستقبل ارقام فقط

  .required()

  .messages({

    "string.empty": "Code is required",

    "string.length": "Code must be 5 digits",

    "string.pattern.base": "Code must contain numbers only",

    "any.required": "Code is required",
  })

/////////////////////////////////////////////////////////////////////////////////////////// 

const verifyOtpSchema = joi.object({

  email: joi.string().trim().lowercase().email().required().messages({

    "string.email": "Invalid email",

    "any.required": "Email is required",

  }),

  code: otpField // دة اسم متغير اوتبي شروط بتاعتة كتابنها فوق كتبتها هنا تاني برضو
})


/////////////////////////////////////////////////////////////////////////////////////////// 

const resetPasswordSchema = joi.object({

  email: joi.string().trim().lowercase().email().required().messages({

    "string.email": "Invalid email",

    "any.required": "Email is required",
  }),

  code: otpField,

  password: registerSchema.extract("password"), // دة بقولوة اعدادات و سكيما بتاع باسورد هو هو نفس سكيما كنت كتبها في لوجين او ريجيستر عشان كدة استخدمت خاصية تبع جوي اسمها اكستريكت يعني هاتلي سكيما باسورد في وريجيستر

  confirmPassword: joi.valid(joi.ref("password")).required().messages({

    "any.only": "Passwords do not match",

    "any.required": "Please confirm your password",

  }),
})


// Joi.valid(...): معناها متقبلش اي قيمة جديد خالص غير قيمة هكتبهالك هنا اللى هو باسورد عشان نتأكد منة ماتش ولا لاء 

// (joi.ref("password")) بقول المرجع هو باسورد يعني معناها خلي كنيمر باسورد دة يكون مطابق لنفس سكيما باسورد برضو بالملي




module.exports = { LoginSchema , forgotPasswordSchema , registerSchema , verifyOtpSchema , resetPasswordSchema}




// const Joi = require("joi")



// const registerSchema = Joi.object({

//  username : Joi.string().required().min(3).trim().messages({


//   "string.empty" : "username must not be empty" ,
  
//   "string.min" : "username must be three letters at least" ,

//   "any.required" : "username is required"
  

//  }) ,


//  email : Joi.string().email().required().trim().messages({


//   "string.empty" : "email must not be empty" , 

//    "string.email" : "Please enter a valid email address" ,

//    "any.required" : "email is required" 


// }) ,



// password : Joi.string().required().min(8).pattern(new RegExp(("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))).messages({


//  "string.empty" : "Password must not be empty" , 

//  "any.required" : "Password is required" , 

//  "string.pattern.base" : "Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters (@$!%*?&)"


// })




// })







