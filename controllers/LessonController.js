


const Lesson = require ("../models/Lesson")

const cloudinary = require("cloudinary").v2


// ### 1- addLesson

const addLesson = async ( req , res ) => {



const { title , description , order , image , pdf  , vedio  } = req .body 


const {courseId} = req.params // الايدي بتاع كورس من رواتيس جيبنوة عشان نعرف درس دة تبع انهي كورس


if (!title || !courseId) {

return res.status(400).json({ success: false , message: "Title and Course ID are required" })}



let imageLesson = { url : ""  , publicId : "" }

let pdfLesson = { url : ""  , publicId : "" }



if(req.files) {


 if(req.files.image && req.files.image[0]){
  
//   بقولوة لو مفتاح صورة عندك وكمان هاتلي اول صورة طبعا احنا هنرفع صورة واحدة فهتكون في مصفوفة انديكس صفر هاتلي صورة واتأكد ان مفتاح صورة موجود
    

imageLesson = {

 url : req.files.image[0].path , 

 publicId : req.files.image[0].filename

}

}   

// req.files = { دة شكل جافا سكريبت في ريجوسيت فايلس خلف كواليس جافا سكريبت

//   image: [ { path: 'https://cloudinary...', filename: 'courses_Documents/xyz' } ],

//   pdf:   [ { path: 'https://cloudinary...', filename: 'courses_Documents/abc' } ]
// }  



if(req.files.pdf && req.files.pdf[0]) {


pdfLesson = {

  url : req.files.pdf[0].path , 
  
  publicId : req.files.pdf[0].filename

} } 




const createLessons = await Lesson.create({

course : courseId , 

title , 

description , 

order ,

image : imageLesson ,

pdf : pdfLesson ,

vedio

})


return res.status(201).json({  message: "Lesson created successfully", lesson : createLessons })

}

}


///////////////////////////////////////////////////////////////////////////////////////// 




// 2-### getAllLessons 


const getAllLessons = async ( req , res ) => {


const { search , limit = 10 , page = 1 } = req.query 

const query = search ? {title : { $regex : search , $options : "i" }} : {}

 const skip = (page - 1) * limit 

 const getLessons = await Lesson.find(query).limit(Number(limit)).skip(skip)

 return res.status(200).json({

 success : true , 
 
 count : getLessons.length , 

 lesson : getLessons
 

 })


}
 



///////////////////////////////////////////////////////////////////////////////////////// 




// 3-### getLessonById



const getLessonById = async ( req , res) => {


 const {lessonId} = req.params 

 const getLessonId = await Lesson.findById(lessonId)
 
 if(!getLessonId) {

  return res.status(404).json({ message : " Lesson is not found " })

 }


return res.status(200).json({ success : true , lesson: getLessonId  })

}




///////////////////////////////////////////////////////////////////////////////////////// 




// 4-### updateLesson


const updateLesson = async ( req , res) => {
 

const { title , description , order , image , pdf  , vedio  } = req .body 

 const {lessonId} = req.params 

 const getLessonToUpdate = await Lesson.findById(lessonId)
 
 if(!getLessonToUpdate) {

  return res.status(404).json({ message : " Lesson is not found " })

 }

 
 if(title) getLessonToUpdate.title = title 

if(description) getLessonToUpdate.description = description

if(order) getLessonToUpdate.order = order

if(vedio) getLessonToUpdate.vedio = vedio


if(req.files) {


if(req.files.image && req.files.image[0]) {

  // بنتأكد ان الأدمن بعت صورة عايز يحدثها عشان ميحدثش بيانات كلها ويجي يحدث الصورة خلط وهو اصلا ادمن مطلبش يحدثها عشان كدة احنا بنحط الشرط دة كحماية في حالة لما ادمن يطلب تحديث صورة

 if(getLessonToUpdate.image && getLessonToUpdate.image.publicId) {

 await cloudinary.uploader.destroy(getLessonToUpdate.image.publicId)

 }


getLessonToUpdate.image = {

 url : req.files.image[0].path , 

 publicId : req.files.image[0].filename

} }



if(req.files.pdf && req.files.pdf[0]) {

  //  نفس كلام برضو عملناة في صورة هنعملوة في بيدف

 if(getLessonToUpdate.pdf && getLessonToUpdate.pdf.publicId) {

  await cloudinary.uploader.destroy(getLessonToUpdate.pdf.publicId)

 } 


getLessonToUpdate.pdf = {

 url: req.files.pdf[0].path ,

 publicId : req.files.pdf[0].filename

}

}

}


await getLessonToUpdate.save() 

return res.status(200).json({ success : true , lesson: getLessonToUpdate , message: "Lesson updated successfully",  })

}




///////////////////////////////////////////////////////////////////////////////////////// 




// 5-### DeleteLesson 


const DeleteLesson = async ( req , res ) => {

 
 const {lessonId} = req.params 
 
 
 const getLessonToDelete = await Lesson.findById(lessonId)

 if(!getLessonToDelete) {

return res.status(404).json({ message : "Lesson is not found"})
 
}

// طالما هنحذف داتا بيز لازم قبلها نحذف الصورة من كلويندري الاول قبل ما نحذف داتا بيز عشان ميكومش على فولدر كليوندري وياخد مساحة على فاضي ويتقل السيرفر وكمان انت ليك باقة مجانية على كلويندري لو عديت الحد الاقصي لمساحة صور هيبدأو يحاسبوك عليها عشان كدة بنحذف صورة وبيدف طالما هنحذف داتا بيز


if(getLessonToDelete.image && getLessonToDelete.image.publicId) {

await cloudinary.uploader.destroy(getLessonToDelete.image.publicId)

}


if(getLessonToDelete.pdf && getLessonToDelete.pdf.publicId) {

await cloudinary.uploader.destroy(getLessonToDelete.pdf.publicId)

}


await getLessonToDelete.deleteOne()

return res.status(200).json({

      success: true,

      message: "Lesson and its files deleted successfully from Database and Cloudinary"
})


}




module.exports = { addLesson , getAllLessons , getLessonById , updateLesson , DeleteLesson }