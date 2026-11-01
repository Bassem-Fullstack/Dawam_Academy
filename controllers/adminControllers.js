



const User = require("../models/User") 

const Course = require("../models/Course") 

const Lesson = require("../models/Lesson") 

const Quiz = require("../models/Quiz") 

const QuizResult = require("../models/QuizResult") 



// ### 1- getAdminStats


const getAdminStats = async ( req , res ) => {


 const totalStudents = await User.countDocuments({ role : "student" })
   
 const totalCourses = await Course.countDocuments({}) 

 const totalQuizzes = await Quiz.countDocuments({})

 const totalResults = await QuizResult.countDocuments({})



return res.status(200).json({


success: true,

stats: {
        totalStudents,

        totalCourses,

        totalQuizzes,

        totalResults
      }


})

}



//////////////////////////////////////////////////////////////////////////////////////////////////////


// ### 2- activeCourseStudent


const activeCourseStudent = async (req , res) => {


const { studentId  , courseId } = req.body 



    const student = await User.findById(studentId)

    if (!student) {

      return res.status(404).json({

        success: false,

        message: "student is not found"

      })
    }

    //  الفحص: هل الكورس موجود بالفعل في مصفوفة كورسات الطالب؟

    const isAlreadyEnrolled = student.purchasedCourses.includes(courseId)

    if (isAlreadyEnrolled) {

      return res.status(400).json({

        success: false ,
        
        message: "This course is already activated for this student"

      })

    }



const updatedUser = await User.findByIdAndUpdate (

    studentId ,

    { $addToSet : { purchasedCourses : courseId  } } ,


    {new : true , runValidators : true } ,

)


return res.status(200).json({

success : true ,

message: "Course activated successfully for this student" ,

user: updatedUser

})


// $addToSet  دة بيضيف القيمة داخل فيليد في مونجوس بس من غير تكرار من غير مايكرر قيم كتير و دة حاجة حلوة

// $push دة بوش بيضيف بس بيضيف من غير ما يعمل تشيك او فحص القيمة اضافت قبل كدة ولا لاء عشان كدة استخدمت ادد تو ليست احسن منها

}


//////////////////////////////////////////////////////////////////////////////////////////////////////


// ### 3- getAllStudents




const getAllStudents = async ( req , res) => {


 const students = await User.find({ role : "student" }).select("-password")


 return res.status(200).json({
 
    success: true, 

    count : students.length , 

    students

 })

}


/////////////////////////////////////////////////////////////////////////////////////////////////// 



// ### 4- deleteStudentByAdmin




const deleteStudentByAdmin = async ( req , res ) => {


const { studentId } = req.params 


const getStudent = await User.findById(studentId)


if(!getStudent) {

return res.status(404).json({ success: false, message: "student is not found" })

}


await User.findByIdAndDelete(studentId)

return res.status(200).json({

      success: true,

      message: "student is already removed successfully"

    })


}


/////////////////////////////////////////////////////////////////////////////////////////////////


// ### 5-revokeCourseFromStudent


const revokeCourseFromStudent = async ( req , res) => {



const { studentId } = req.params;

const { courseId } = req.body


const student = await User.findById(studentId)

if (!student) {

return res.status(404).json({ success: false, message: "student is not found" })

}


const updatedStudent = await User.findByIdAndUpdate(

      studentId,

      { $pull: { purchasedCourses: courseId } },

      { new: true , runValidators : true})
    
      .select("-password")
 
//دة راوت بنعدل على كورس الطالب فحالة لو ادمن عايز يسحب كورس من الطالب دة عادي ومش عايز يفعل كورس لهو



return res.status(200).json({

      success: true,

      message: "course is already removed from the student",

      student: updatedStudent

    })

}










module.exports = { activeCourseStudent ,  getAdminStats , getAllStudents , deleteStudentByAdmin ,  revokeCourseFromStudent }


























