// Import required modules
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Testing route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Contact form handling
app.post("/send-email", (req, res) => {
    const { name, email, surname, courseDetails } = req.body;
    console.log(req.body);

    // Create transporter for sending emails
    const transporter = nodemailer.createTransport({
        service: "gmail", // Use your email service
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app password
        },
    });

    // Email content
    const mailOptions = {
        from: email, // Sender's email
        to: process.env.RECIPIENT_EMAIL, // Admin email
        subject: `Course Inquiry from ${name} ${surname}`,
        text: `Name: ${name}\nSurname: ${surname}\nEmail: ${email}\nCourse Details: ${courseDetails}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
            return res.status(500).json({ statusCode: 500, message: "Error sending email" });
        }
        console.log("Email sent: " + info.response);
        return res.status(200).json({ statusCode: 200, message: "Email sent successfully" });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});