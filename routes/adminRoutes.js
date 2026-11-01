

const router = require('express').Router()


const { activeCourseStudent ,  getAdminStats , getAllStudents , deleteStudentByAdmin ,  revokeCourseFromStudent }

= require('../controllers/adminControllers')

const { verifyToken, isAdmin } = require('../middleware/verifyToken');

/////////////////////////////////////////////////////////////////////////////


router.get('/stats', verifyToken, isAdmin, getAdminStats);


router.get("/students", verifyToken, isAdmin, getAllStudents)

router.patch('/active-course', verifyToken, isAdmin, activeCourseStudent)

router.patch("/student/:studentId/revoke-course", verifyToken, isAdmin, revokeCourseFromStudent)

router.delete("/student/:studentId", verifyToken, isAdmin, deleteStudentByAdmin);


module.exports = router



