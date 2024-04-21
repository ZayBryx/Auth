const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ to, OTP }) => {
  const mailOptions = {
    from: {
      name: "Auth",
      address: "zybryxm@gmail.com",
    },
    to: to,
    subject: "Verify Gmail Account",
    html: `
      <p>Your verification code is:</p>
      <h1 style="font-size: 36px; font-weight: bold;">${OTP}</h1>
      <p>Please use this code to verify your account.</p>
    `,
  };

  await sendEmail(mailOptions);
};

module.exports = sendVerificationEmail;
