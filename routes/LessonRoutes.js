


const router = require("express").Router()


const { verifyToken , isAdmin } = require("../middleware/verifyToken") 


const verifyCourseAccess = require("../middleware/authMiddlewareContent")


const { addLesson , getAllLessons , getLessonById , updateLesson , DeleteLesson }

  = require("../controllers/LessonController")


const upload = require("../config/cloudinary")


////////////////////////////////////////////////////////////////////////////////////////////// 

router.post("/:courseId/addLesson" , verifyToken , isAdmin, upload.fields([ { name : "image" } , { name : "pdf" } ]) , addLesson )


router.get("/" , verifyToken , verifyCourseAccess , getAllLessons )

router.get("/:lessonId"  , verifyToken , verifyCourseAccess , getLessonById )

router.patch("/update/:lessonId" , verifyToken , isAdmin , upload.fields([ { name : "image" } , { name : "pdf" } ]) , updateLesson )

router.delete("/delete/:lessonId" , verifyToken , isAdmin , DeleteLesson )



module.exports = router



// upload.fields لما يكون عندك اكتر من حقل هترفعوة زاي حقل لبيدف وحقل للصور وحقل اخر للفيديو بتسخدم فيليدس مش ايرري

// upload.array بتستخدم لما يكون عندك حقل واحد فقط بس فية اكتر من صورة او اكتر من فيديو واحد فقط يعني حقل واحد بس في حاجات كتيرة جدا وكلها تبع نفس الحقل فهمت 

// array بيتعامل لو فية اكتر من عنصر في حقل واحد 

// fileds بيتعامل لو فية اكتر من حقل زاي حقل للرفع صور وحقل تاني لرفع بيدف وحقل اخر لرفع فيديو
