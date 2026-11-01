

const router = require("express").Router()


const { CreateCourse , getAllCourses , getCourseById , updateCourse , deletedCourse }

= require ("../controllers/courseController")



const { verifyToken , isAdmin } = require("../middleware/verifyToken")


const upload = require("../config/cloudinary")


router.post ("/add" , verifyToken , isAdmin , upload.single("image") , CreateCourse )

router.get("/" , verifyToken , getAllCourses )

router.get("/:id" , verifyToken , isAdmin , getCourseById )

router.patch("/update/:id" , verifyToken , isAdmin , upload.single("image") , updateCourse ) 

router.delete("/delete/:id" , verifyToken , isAdmin , deletedCourse )


module.exports = router
