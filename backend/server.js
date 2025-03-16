const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const app = express();
const PORT = 5000;
const DATA_FILE = "../data.json";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load existing data or initialize an empty array
let reminders = [];
if (fs.existsSync(DATA_FILE)) {
    const fileData = fs.readFileSync(DATA_FILE);
    reminders = JSON.parse(fileData);
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'alihaiderur1415@gmail.com',
      pass: 'tswt wgpw ipzh pego',
    },
  });

// Schedule Email Sending with Cron (Runs Every Day at Midnight)
cron.schedule("0 0 * * *", () => {
    console.log("Checking for reminders...");
  
    const today = new Date().toISOString().split("T")[0];
  
    reminders.forEach((reminder) => {
      if (reminder.eventDate === today) {
        sendReminderEmail(reminder);
      }
    });
  });
  
  // Function to send reminder emails
  function sendReminderEmail(reminder) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reminder.customerEmail,
      subject: `Reminder: ${reminder.eventName}`,
      text: `Hello, \n\nThis is a reminder for ${reminder.eventName} happening on ${reminder.eventDate}.\n\nThank you!`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

// API to handle form submission
app.post("/submit", (req, res) => {
    const formData = req.body;

    // Extract reminders from flat object structure
    let newReminders = [];
    for (let i = 1; i <= 3; i++) {
        if (formData[`eventName${i}`] && formData[`eventDate${i}`] && formData[`customerEmail${i}`]) {
            newReminders.push({
                eventName: formData[`eventName${i}`],
                eventDate: formData[`eventDate${i}`],
                customerEmail: formData[`customerEmail${i}`],
                eventType: formData[`eventType${i}`] === "Other" ? formData[`otherEventType${i}`] : formData[`eventType${i}`],
            });
        }
    }

    if (newReminders.length === 0) {
        return res.status(400).json({ success: false, message: "At least one valid reminder is required!" });
    }

    // Save to JSON
    reminders.push(...newReminders);
    fs.writeFileSync(DATA_FILE, JSON.stringify(reminders, null, 2));

    res.json({ success: true, message: "Reminders added successfully!" });

});

// API to fetch reminders
app.get("/reminders", (req, res) => {
    res.json(reminders);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
