const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (
  userEmail,
  userName,
  verificationLink
) => {
  try {
    const response = await resend.emails.send({
      from: "Readora <onboarding@resend.dev>",
      to: userEmail,
      subject: "Verify Your Readora Account 📚",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h1 style="color:#4f46e5;">📚 Welcome to Readora</h1>

          <p>Hi <strong>${userName}</strong>,</p>

          <p>
            Thank you for joining <b>Readora</b>.
          </p>

          <p>
            Please verify your email address by clicking the button below.
          </p>

          <a
            href="${verificationLink}"
            style="
              display:inline-block;
              background:#4f46e5;
              color:white;
              text-decoration:none;
              padding:12px 24px;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Verify Email
          </a>

          <p style="margin-top:25px;">
            If you didn't create this account,
            you can safely ignore this email.
          </p>

          <hr>

          <p style="color:gray;">
            © BookVerse Team
          </p>
        </div>
      `,
    });

    console.log("Verification email sent.");
    return response;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
};