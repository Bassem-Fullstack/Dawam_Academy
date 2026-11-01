



const router = require("express").Router()



const {verifyToken , isAdmin} = require("../middleware/verifyToken")

const verifyCourseAccess = require("../middleware/authMiddlewareContent")


const{ createQuiz , getQuizByLesson , getAllStudentsResults ,  scoreStudents , updateQuiz , updateQuestionQuiz , deleteQuiz }

= require("../controllers/QuizControllers")


///////////////////////////////////////////////////////////////////////////////////////// 

router.post("/add" , verifyToken , isAdmin , createQuiz )


router.get("/:lessonId" , verifyToken , verifyCourseAccess  , getQuizByLesson )


router.get("/admin/results", verifyToken, isAdmin, getAllStudentsResults);


router.post("/:quizId/submit" , verifyToken , verifyCourseAccess, scoreStudents )


router.patch("/:quizId/update" , verifyToken , isAdmin , updateQuiz )


router.patch("/:quizId/question/:questionId" , verifyToken , isAdmin , updateQuestionQuiz )


router.delete("/:quizId" , verifyToken , isAdmin , deleteQuiz )



module.exports = router 