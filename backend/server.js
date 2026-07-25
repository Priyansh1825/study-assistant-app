const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the exact JSON structure we expect the AI to return
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

app.post('/api/generate-cards', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
        return res.status(400).json({ error: "Topic or notes are required." });
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: flashcardSchema,
        }
    });

    const prompt = `You are a study assistant. Generate a set of educational flashcards based on the following topic or notes. Keep the answers concise.\n\nNotes: ${topic}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse it to ensure it's valid before sending to frontend
    const parsedData = JSON.parse(responseText);
    res.json(parsedData);

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate flashcards. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));