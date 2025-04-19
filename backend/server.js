const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

app.post("/chat", async (req, res) => {
    try {
        const { message, format } = req.body;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: message }] }]
        }, {
            headers: { "Content-Type": "application/json" }
        });

        let reply = response.data.candidates[0].content.parts[0].text;
        
        // Add markdown formatting if needed
        if (format === "markdown") {
            reply = `**AI Response:**\n\n${reply}`;
        }

        res.json({ reply });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch response" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
