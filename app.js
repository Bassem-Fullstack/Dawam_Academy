


const express = require("express") 


const cors = require("cors")

const app = express()

const ConnectDB = require("./config/db")

const cookieParser = require("cookie-parser")

const authRoutes = require("./routes/authRoutes")

const courseRoutes = require("./routes/CourseRoutes")

const lessonRoutes = require("./routes/LessonRoutes")

const quizRoutes = require("./routes/QuizRoutes")

const adminRoutes = require('./routes/adminRoutes')

const helmet = require("helmet") // دة بيمنع بيانات تظهر في الهيدرس وقت ارسال طلب لفروند زاي السيرفر شغال على اكسبريس او يمنع هكر ان ياخد موقعك كوبي بيست من لينك ويحطوة في ايفريم ويستخدموة في موقعة مع دمج برامج خبيثة تبع هكر ويخلي موقعك شفاف 


ConnectDB()

app.use(helmet())

app.set("trust proxy" , 1) // trust proxy" دي كلمة ثابتة في اعداد اكسبريس بقولوة هاتلي رقم ip بتاع جهاز دة صح

// والغرض الأساسي من استخدامها هو إننا بنقول للسيرفر: "لو سمحت، هاتلي وانتبه لعنوان الـ IP الحقيقي بتاع جهاز المستخدم اللي قاعد في بيته، ومتتلخبطش وتاخد سيرفر بتاع IP بتاع شركة الاستضافة الوسيطة

app.use(cors({

origin : process.env.CLIENT_URL ,

credentials : true 

})) 

app.use(express.json())



app.use(cookieParser())

app.get("/" , (req , res) => {


res.json("server is working well")

})


/////////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/api/auth" , authRoutes)

////////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/api/course" , courseRoutes)


/////////////////////////////////////////////////////////////////////////////////////////////////////


app.use("/api/lesson" , lessonRoutes)


/////////////////////////////////////////////////////////////////////////////////////////////////////


app.use("/api/quiz" , quizRoutes)


/////////////////////////////////////////////////////////////////////////////////////////////////////

app.use('/api/admin', adminRoutes)


/////////////////////////////////////////////////////////////////////////////////////////////////////


app.use((err , req , res ,next) => {

if(err.code === 11000){

return res.status(409).json({ message : "This value already exists" })

// دة في حالة المستخدم دخل حاجة متكررة وهي اصلا في منجوش عندنا فريدة او ممنوع يتكرر بنبعتوة رسالة دي دة ايرور اسمة 

// Duplicate تكرار اخطاء قيمة متكررة  اكتر من مرة

}



if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {

  return res.status(401).json({ message: "Invalid or expired token" })

//  بقولوة لو نوع ايرور توكين غير صالح توكين مش صحيح او توكين انتهي صلاحيتة ارمي ايرور دة للمستخدم

}


if(err.name === "ValidationError"){

 return res.status(400).json({ message : err.message })

// ValidationError دة تبع مونجوس في حالة لو حصل ايرور لقيمة مطلوب ومتكتبش بتظهر للمستخدم وقيمة مطلوبة ادخالها لكن مستخدم مدخالهاش بيجي بقي كونتليير يباصي نوع ايررور دة هنا ونعرضوة للمستخدم دة ايرور في حالة مستخدم مدخلش قيمة وهي اصلا مطلوبة او ممكن قيمة مخالفة لقواعد مش مطلوبة او الموجودة في سكيما داتا بيز


}


if (err.name === "CastError") {

  return res.status(400).json({ message: "Invalid id" })
 
//   دة نوع خطأ تبع مونجوس لما بتعبت قيمة ايدي خلط يعني مثلا بدور على مستخدم بدور علية عن طريق الأيدي لو الايدي بتاعوة طلع خلط قيمة مش معرفة هيظهرلي ايرور دة

// err = {
//   name: "CastError",
//   message: "Cast to ObjectId failed..."
// } 

// err.name دي خاصية بيلد ان في جافا سكريبت بتعرف نوع خطأ اية او اسم خطأ اية وتعرض رسالة جاية معاة من كونتلير من سيرفر




// err.status() دة مش بيلد ان في جافا سكريبت دة حاجة انت بتضيفها يعني قيم بتفرضها من عندك عشان لكن نيم والماسيج بيلدان في جافا سكريبت 

// err.code نفس الكلام برضو زاي فوق وهنا استخدمناها تحديدا عشان مونجوس بيطلع ايرور اسمة كود و دة بيحصل لما يكون قيم متكررة وهي اصلا مفروض متكررش فريدة  

}


console.log(err)




res.status(err.status || 500).json({

message : err.status ? err.message : "something went wrong"

})

// دة بقي بقولوة اي نوع او اي حالة من ايرور اعرضها للمستخدم وشوف ليها ماسج ليها ولا لاء لو مالهاش ماسج اعرضلي رسالة دي في مشكلة في سيرفر واعرضلي معاها حالة 500  

})

module.exports = app






