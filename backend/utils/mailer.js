import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  if (!to) throw new Error("Recipient email address is missing!");

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: false, // use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password for Gmail
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP server verified");

    const info = await transporter.sendMail({
      from: `"Narya Baby" <${process.env.SMTP_USER}>`, // sender
      to, // recipient — must be the customer email
      subject,
      html,
      replyTo: process.env.SMTP_USER, // optional: replies go to your SMTP email
    });

    console.log("✅ Email sent successfully:", info.messageId);
  } catch (err) {
    console.error("❌ Email send error:", err);
    throw err; // bubble up error
  }
};
