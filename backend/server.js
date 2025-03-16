const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

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
