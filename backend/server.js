const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const flashcardSchema = {
  type: SchemaType.OBJECT,
  properties: {
    cards: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: { type: SchemaType.STRING },
          answer: { type: SchemaType.STRING }
        },
        required: ["question", "answer"]
      }
    }
  },
  required: ["cards"]
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_actual_api_key_here')
  });
});

app.post('/api/generate-cards', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic or notes are required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_actual_api_key_here') {
      return res.status(500).json({
        error: "Gemini API key is not configured. Please set a valid GEMINI_API_KEY in backend/.env."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: flashcardSchema,
      }
    });

    const prompt = `You are a study assistant. Generate a set of educational flashcards based on the following topic or notes. Keep the answers concise.\n\nNotes: ${topic}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const parsedData = JSON.parse(responseText);
    res.json(parsedData);

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate flashcards. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));