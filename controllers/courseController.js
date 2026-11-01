


const Course = require("../models/Course")

const Cloudinary = require("cloudinary").v2


const CreateCourse = async(req , res) => {


 const { title , description , image } = req.body 


if(!title || ! description) {

return res.status(400).json({ message : " title or description are required " })

}



let ImageURL = "" ; // عشان نخزن الصورة في كريت على طول نحط لينك

let imagePublicId = ""

if(req.file) {

ImageURL = req.file.path
 
imagePublicId = req.file.filename

}


const addSection = await Course.create({

title , 

description , 

image : ImageURL ,

imagePublicId

}) 



return res.status(201).json({ message : "Section added Successfully" , addSection })

}


/////////////////////////////////////////////////////////////////////////////////////////////////////


// ### 2- getAllCourses 



const getAllCourses = async ( req , res) => {


const { search , limit=10  , page = 1} = req.query

const query = search ? {title : {$regex : search , $options : "i"}} : {}

// فلتري حقل تايتل فقط لو مستخدم كتب حاجة في سيرش بحث لو مكتبش حاجة في حقل هاتلي جميع سكاشن كلها اول عشرة يعني في اول صفحة

const skip = (page-1) * limit

const courses = await Course.find(query).limit(Number(limit)).skip(skip)

// limit(Number(limit)) الخاصية ليميت دي بتستقبل ارقام فقط والمتغير ليميت اللى جاي من يو ار ال بيجي على هيئة نصوص عشان كدة حولتة نمبر عشان خاصية دي مبتفهمش غير رقم

return res.status(200).json({

success : true , 

count : courses.length ,

course : courses


})

}


/////////////////////////////////////////////////////////////////////////////////////////////////////


// ### 3- getCourseById 



const getCourseById = async( req , res) => {


const {id} = req.params

const getCourse = await Course.findById(id)

if (!getCourse) {
      return res.status(404).json({ message: "Course not found" });
    }


    return res.status(200).json({

      success: true,

      course: getCourse

    })

}




/////////////////////////////////////////////////////////////////////////////////////////////////////


// ### 4- updateCourse 



const updateCourse = async( req , res ) => {


  const {id} = req.params 

   const {title , description } = req.body 

  const getCourseToUpdate = await Course.findById(id)

  if(!getCourseToUpdate) {

    return res.status(404).json({ message: "Course not found" })
 
  }

 let updatedImageURL = getCourseToUpdate.image 

 let ImagePublicId = getCourseToUpdate.imagePublicId

 if(req.file) {
  
 if(getCourseToUpdate.image && getCourseToUpdate.imagePublicId) {

  await Cloudinary.uploader.destroy(getCourseToUpdate.imagePublicId)

 }


   updatedImageURL = req.file.path
   
   ImagePublicId = req.file.filename

}


const updatedCourse = await Course.findByIdAndUpdate(id , {

title ,

description , 

image : updatedImageURL ,

imagePublicId : ImagePublicId


} ,

{new : true , runValidators : true}

) 


return res.status(200).json({
  
      success: true,

      message: "Course updated successfully",

      course: updatedCourse
    });


}


/////////////////////////////////////////////////////////////////////////////////////////////////////


// ### 5-  deletedCourse



const deletedCourse = async ( req , res) => {


 const { id } = req.params 


 const getCourseToDelete = await Course.findOneAndDelete(id) 

 if(!getCourseToDelete) {

  return res.status(404).json({ message: "Course not found" }); 

 }


  if (getCourseToDelete.imagePublicId) {

    await Cloudinary.uploader.destroy(getCourseToDelete.imagePublicId)
  }


return res.status(200).json({

      success: true,

      message: "Course deleted successfully"

})

}




module.exports = { CreateCourse , getAllCourses , getCourseById , updateCourse , deletedCourse }
