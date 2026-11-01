

// const nodemailer = require("nodemailer")

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_APP_PASSWORD,
//   },
// })

// const SendEmail = async (to, subject, htmlContent) => {
//   try {
//     await transporter.sendMail({
//       from: `"Dawam Academy" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//     })
//   } catch (err) {
//     console.error("Email error:", err.message)

//     const error = new Error("Failed to send email, please try again")
//     error.status = 500
//     throw error
//   }
// }

// module.exports = SendEmail





const nodemailer = require("nodemailer")


const transport = nodemailer.createTransport({

service : "gmail" ,

port : 465 ,

secure : true ,

auth : {

  user : process.env.EMAIL_USER ,

  pass : process.env.EMAIL_APP_PASSWORD

}

})




const SendEmail = async ( to , subject , html) => {


 try {
     
     await transport.sendMail({
     
      from : `"Dawam-Acadmy" <${process.env.EMAIL_USER}>` ,
      
      to , 

      subject ,

      html 


     })

   }
 

  catch(err){
   
console.error("Email sending error details:", err);
  
   
    const error = new Error ("Failed to send email, please try again") 
      
    
    error.status = 500 

    throw error


  }


}


module.exports = SendEmail





