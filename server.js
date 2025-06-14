const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const GEMINI_API_KEY = process.env.API_KEY;
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post('/chat', async (req, res) => {
  const userInput = req.body?.userInput;

  if (!userInput) {
    return res.status(400).json({ error: 'Missing userInput' });
  }

  try {
    const response = await axios.post(
      MODEL_URL,
      {
        contents: [
          {
            parts: [{ text: userInput }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ response: textResponse });

  } catch (error) {
    console.error('Error from Gemini API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Gemini API error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
