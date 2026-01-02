require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API de Chatbot activa 🤖");
});

// Ruta del chatbot
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Eres un asistente claro y útil." },
        { role: "user", content: userMessage },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("ERROR OPENAI:", error);
    res.status(500).json({
      error: error.message || "Error desconocido con la IA",
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
