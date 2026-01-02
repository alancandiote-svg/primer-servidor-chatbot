require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();

// 👉 CONFIG OPENAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// 👉 MOSTRAR INTERFAZ WEB
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 👉 CHATBOT IA
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

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
    res.status(500).json({ error: "Error con la IA" });
  }
});

// 👉 PUERTO (LOCAL + RENDER)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
