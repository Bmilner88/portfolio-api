const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();

const limiter = rateLimit({
  windowMs: 30000,
  max: 1,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(limiter);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`Server is ready to take messages: ${success}`);
});

app.post("/api/send/", (req, res) => {
  const mailOptions = {
    from: `${req.body.email}`,
    to: process.env.EMAIL,
    subject: `Message from: ${req.body.name}`,
    text: `${req.body.message}

Email Address: ${req.body.email}`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error");
      res.json({
        status: "fail",
        message: err,
      });
    } else {
      console.log("Message sent");
      res.json({
        status: "success",
        data: data,
      });
    }
  });
});

app.get("/api/get/cron", (res) => {
  return res.json({
    cron: "success!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
