const nodemailer = require("nodemailer");

// Create a nodemailer transporter with your SMTP settings
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "zkbookworm007@gmail.com",
    pass: "cxwb sylc olwb fxys",
  },
});
const sendEmail = (email, subject, emailbody)=>{
  // Compose the email
  const mailOptions = {
    from: "zkbookworm007@gmail.com",
    to: email,
    subject: subject,
    text: emailbody,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
module.exports = sendEmail