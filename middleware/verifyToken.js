



const jwt = require("jsonwebtoken") 




const verifyToken = ( req , res , next) => {


const token = req.headers.authorization?.replace("Bearer " , "")


if(!token) {

return res.status(401).json({ message: "No token provided" })

}

const decode = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)


req.user = decode 


// req.user = decoded = { توكين جاي من مستخدم فية قيم داخل اوبجكيت دة
//   userID: "65f2a...",   // من عندك
//   role: "student",      // من عندك
//   iat: 1728230000,      // وقت إنشاء التوكن (تلقائي)
//   exp: 1728230900       // وقت انتهائه (تلقائي)
// }


next ()


}



////////////////////////////////////////////////////////////////////////////////////////////


const isAdmin = (req , res , next) => {


if(req.user.role !== "admin") {

return res.status(403).json({ message : "Access denied, admin only"})

}

next()

}




module.exports = {verifyToken , isAdmin}
