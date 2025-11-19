const router = require("express").Router();
const OpenAI = require("openai");
const { protectRoute } = require("../Middleware/authMiddleware.js");
let transaction = require("../Models/Transaction.js");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/chat", protectRoute, async (req, res) => {
  try {
    const { message } = req.body;

    const Transactions = await transaction.find({ User: req.user._id });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are a financial assistant chatbot.
            Analyze the user's data and answer their questions.
            User transaction data (JSON): ${JSON.stringify(Transactions)}
          `,
        },
        { role: "user", content: message },
      ],
    });

    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
