const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "<amine Kabli>",
    subject: "test",
    to: options.email,

    html: `<h2>HI ${options.name} </h2> \n 
     <p>this is your rest code </p>
     <h1>${options.restCode}<h2>`,
  });
};

module.exports = sendEmail;
