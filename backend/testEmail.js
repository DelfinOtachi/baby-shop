import dotenv from "dotenv";
dotenv.config();

import { sendEmail } from "./utils/mailer.js";

const runTest = async () => {
  await sendEmail({
    to: "delfinotachi254@gmail.com",
    subject: "Test Email from Narya Baby",
    html: "<h1>Hello! This is a test email.</h1><p>If you see this, your SMTP works.</p>",
  });
};

runTest();
