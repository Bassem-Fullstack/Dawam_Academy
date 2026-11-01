







const User = require("../models/User")



const verifyCourseAccess = async ( req , res , next ) => {

const userId = req.user.userID 

const courseId = req.params.courseId || req.body.courseId // بنأمن نفسنا نشوف كورس ايدي دة جاي من لينك ولا جاي من بادي لان انا عملت كورسات الايدي بتاعها بتيجي من بادي وكورسات اخري بتيجي من عن طريق لينك يو ار ال عشان كدة بأمن نفسي 


const getUser = await User.findById(userId)

if (!getUser) {

return res.status(404).json({ success: false, message: " user not found" })

}


const isPurchased = getUser.purchasedCourses.includes(courseId) 

// هل الكورس دة الطالب اشتراة لو اشتراة بيعرضلوة محتوي الفيديو والصور والاسئلة طيب لو الطالب طلع مش مشتري الكورس يعرضلوة رسالة دي ان هو لازم يشتري كورس 

// getUser.role === "admin" استخدمت دة عشان خاطر ميضربش برضو ايرور للأدمن ويقولوة اشتري كورس وهو دة الأدمن مينفعش يظهرلوة رسالة زاي دي كدة عشان كدة بقولوة طالما دة مش الادمن وكمان طالب مش مشتري كورس اعرضلوة رسالة دي فقط

if(!getUser.role === "admin" && !isPurchased) {

 return res.status(403).json({

  message : "Sorry, you must purchase the course to be able to watch it"

 })

}


next () 

}


module.exports = verifyCourseAccess
