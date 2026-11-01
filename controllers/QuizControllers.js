



const Quiz = require("../models/Quiz")

const QuizResult = require("../models/QuizResult")


// 1## createQuiz

const createQuiz = async( req , res ) => {


const { title , course , lesson , questions , passingScore } = req.body


 
if (!title || !course || !lesson || !questions || questions.length === 0){
 
return res.status(400).json({ success: false , message : "Title, course, lesson, and at least one question are required" })

}



  const addQuiz = await Quiz.create({

  title , 
  
  course , 

  lesson ,

  questions , 

  passingScore
  
  }) 


 return res.status(201).json({ 

  success: true , 

  message: "Quiz created successfully" ,

  quiz : addQuiz  

 })


}


///////////////////////////////////////////////////////////////////////////////////////////////


// 2 ## getQuizByLesson



const getQuizByLesson = async ( req , res ) =>  {

 
  const { lessonId} = req.params 
console.log("Received lessonId from URL:", req.params.lessonId); 
  const getQuiz = await Quiz.findOne({ lesson : lessonId}).select("-questions.correctAnswer")
  
    // بقولوة هاتلي اختبار بتاع الدرس دة للطلاب بس من غير اجابات صحيحة طبعا

console.log("Found Quiz in DB:", getQuiz); // 👈 هل رجع بأوبجكت ولا null؟
 if(!getQuiz) {

  return res.status(400).json({ message: "Quiz not found" })

 }


return res.status(200).json({ getQuiz })

}



//////////////////////////////////////////////////////////////////////////////////////////////////


// ### 3- scoreStudents تقييم الطالب ونخزن نتيجة بتاعتة في سكيما


const scoreStudents = async ( req , res ) => {

const { answers } = req.body // خلي بالك فروند اند هيبعتلك مصفوفة من اجابات بتاع مستخدم عشان نبدأ نقارنها بالاجابات صحيحة متخزنة عندنا عشان نعرف نقيموة ونديلوة الدرجة الصحيحة

const  { quizId } = req.params 


const studentId = req.user.userID // دي جاية من ميدل وير

console.log("studentId :" , studentId)

const getQuiz = await Quiz.findById(quizId) // احنا طبعا مستخدمناس سيلكيت ونخفي اجابات صحيحة لأننا عايزين نقارن اجابات مستخدم بأجابات صحيحة

 if(!getQuiz) {

  return res.status(400).json({ message: "Quiz not found" })

 }


 let startToScore = 0 // دة زاي عداد بيقيم الاجابات اللى جاوبها الطالب كام اجابة جاوبها فقط 

 let startToTotalScore = 0 // دة عداد بيحسب الاسألة من كام درجة عشان نعرف الاختبار من كام درجة 


getQuiz.questions.forEach((q) => {

  // هنخزن بقي درجة الأختبار نفسة في متغير هنا عشان نعرف ان امتحان من كام درجة ما انت ممكن يكون عندك سوال بدرجة او ممكن ادمن يعمل سوال تاني من درجتين في تلك الحالتين بنخزن درجة نهائية بتاع اختبار في متغير هنا عشان نقسموة على عدد اجابات اللى جاوبها الطالب 
 
   startToTotalScore += q.score // دي عدد درجات الاسئلة اللى هنقسمها على عدد اجابات الاسئلة صحيحة 


  // محتاجين نقارن اجابات اللى جاية من فروند اند بالاجابات متخزنة عندي في داتا بيز عشان لو اجابة طلعت صح نزود درجة بتاعتة

  const studentAn = answers.find((a) => {

  return a.questionId.toString() === q._id.toString()

//  احنا هنا بنربط الايدي بتاع الاجابة اللى جاية من فروند اند بالا يدي بتاع اسئلة متخزنة في داتا بيز عندنا و كدة كدة هما هما نفس الايدي ونفس قيمة كدة ايدي بتاع سوال اللى اتخزن في يوس ستيت في رياكت هو هو نفس قيمة الايدي بتاع الاجابة بتاع مستخدم 

  }) 

   if( studentAn && studentAn.selectedAnswer === q.correctAnswer ) {

    startToScore += q.score // بنشوف بنجمع اجابات الصحيحة اللى طالب جاوبها فقط ونزود علية درجة او درجتين على حساب السوال من كام درجة لو كان اجابة طالب صحيحة

   }



  //q._id. لما بتعمل مصفوفة جوة داتا بيز في مونجو ديبي بيعملها ايدي تلقائي لوحدة عشان كدة الايدي بتاع الاسئلة في مصفوفة متخزن فية كل سوال لهو ايدي

// toString() عشان خاطر في مونجو ديبي مقارنة بتكون كدة بص تحتك 

// "168242724722442" === objectId("168242724722442") كدة خلط مش هيعرف يقارن مابينهم لأن كلمة اوبجكيت ايدي موجود مابينهم لهذا السبب استخدمت خاصية توسترينج عشان نقارن سترينج نصوص ببعض مش اوبجكيت ايدي معاة

//   { الفروند اند هيبعتلك طلب بكل اجابات بتاع طالب دة في مصفوفة داخل اوبجكيت انت هتستلم اجابات بتاعتة اللى جاوبها مع ايدي بتاع كل اجابة عشان نبدأ نقارن اذا كان اجابة اللى جاوبها طالب نفس الاجابة صحيحة متخزنة عندنا في داتا بيز

//   "answers": [

//     { "questionId": "123", "selectedAnswer": "JavaScript" } دة الايدي هو هو نفس قيمة الايدي متخزن في داتا بيز عشان كدة بنربطة بالسوال في داتا بيز ونعرف مستخدم اختار انهي اجابة,

//     { "questionId": "456", "selectedAnswer": "Express.js" }
//   ]
// }

})



let status = "failed"  // بنفترض في الأول إنه راسب


// لو درجاته أكبر من أو تساوي نص الدرجة الكلية

if(startToScore >= startToTotalScore * 0.5) {

  status = "passed" // نغيرها لـ ناجح

}



const createResultQuiz = await QuizResult.create({


student : studentId , 

quiz :  quizId , 

scoreObtained : startToScore , 

totalScore : startToTotalScore , 

status,


})
 

return res.status(201).json({ 

  success: true, 

  message: "Quiz submitted successfully",

  result: {

    scoreObtained: createResultQuiz.scoreObtained,

    totalScore: createResultQuiz.totalScore,

    status: createResultQuiz.status,

    createdAt: createResultQuiz.createdAt
  }

})

}



///////////////////////////////////////////////////////////////////////////////////////////////////




// ## 4- updateQuiz 


const updateQuiz = async ( req , res ) => {


  const {quizId } = req.params 
  
  const { title , course , lesson , passingScore } = req.body
   
  
  const updateQuiz = await Quiz.findByIdAndUpdate(

    quizId , { title, course, lesson, passingScore } , { runValidators : true , new : true }

  )

  if (!updateQuiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
   

return res.status(200).json({

      success: true,

      message: "Quiz basic details updated successfully",

      quiz: updateQuiz

    })


}



//////////////////////////////////////////////////////////////////////////////////////////////////////////




// ### 5- updateQuestionQuiz 


  
const updateQuestionQuiz = async (req , res ) => {


 const { quizId , questionId } = req.params 

const questionData = req.body.questions ? req.body.questions[0] : req.body

// انا بقولوة للبادي لو انت شايل مصفوفة اسمها كويشينس هاتلي او عنصر بس اللى هو في مفتاح قيم بتاعنا لو مش شايل خد حقول مباشرة 

 const { questionText  , correctAnswer , options , score } = questionData



 const updateQuestions = await Quiz.findOneAndUpdate(

   { _id : quizId , "questions._id" : questionId } , // عشان اوصل لأيدي بتاع سوال نفسة استخدمت علامتين تنصيص لان طبعا جافا سكريبت ممنوع تكتب نقطة داخل اوبجكيت وانت بستدعي حاجة عشان كدة كتبتها مابين علامتنين تنصيص عشان يعرف اني انا بستدعي الايدي بتاع سوال  


   {

       $set : {

         "questions.$.questionText" : questionText ,  // علامة دولار دي معناها عشان يعرف انهي حقل اللى هيتحدث يعني انت ممكن تحدث حقل واحد وباقي حقول تفضل زاي ماهما عشان كدة استخدمنا علامة دولار دي مابينهم
          
         "questions.$.correctAnswer" : correctAnswer , 

         "questions.$.options"  : options , 

         "questions.$.score" : score


       } 

   },


 { new : true , runValidators : true }

 )


if (!updateQuestions) {
      return res.status(404).json({ success: false, message: "Quiz or Question not found" });
    }


   return res.status(200).json({

      success: true,

      message: "Question updated successfully",

      quiz: updateQuestions

    })

    // $ set للتعديل حقل معين او تغير قيمة حقل معين 

    //  $ push لو هتضيف قيمة جديدة داخل الحقل 

    //  $ pull لو هتحذف حقل تمام 

    // $ inc لو هتزود قيمة معينة داخل الحقل

 }


///////////////////////////////////////////////////////////////////////////////////////////////////////////// 



// ### 6- deleteQuiz 


 
const deleteQuiz = async ( req , res ) => {


const { quizId } = req.params 

const getQuizToDelete = await Quiz.findOneAndDelete(quizId)


if (!getQuizToDelete) {

 return res.status(404).json({ success: false, message: "Quiz not found" })

}


res.status(200).json({ success : true , message : "you deleted quiz successfully"  })
 

}


//////////////////////////////////////////////////////////////////////////////////////////////



// ### 7- getAllStudentsResults


const getAllStudentsResults = async (req, res) => {

  
    const results = await QuizResult.find({})

      .populate("student", "name email") 

      .populate("quiz", "title") 

      .sort({ createdAt: -1 });       

    return res.status(200).json({
      success: true,

      count: results.length,

      results

    })

  }  



/////////////////////////////////////////////////////////////////////////////////////////



module.exports = { createQuiz , getQuizByLesson ,  scoreStudents , updateQuiz , updateQuestionQuiz , deleteQuiz , getAllStudentsResults }








