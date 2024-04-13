const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ to, verificationToken, userId }) => {
  const mailOptions = {
    from: {
      name: "Auth",
      address: "zybryxm@gmail.com",
    },
    to: to,
    subject: "Verify Gmail Account",
    html: `<p>Please click the following link to verify your account: <a href="http://localhost:2024/api/auth/verify?token=${verificationToken}&id=${userId}">Verify</a></p>`,
  };

  await sendEmail(mailOptions);
};

module.exports = sendVerificationEmail;
