const express = require('express');
const router = express.Router();
const OpenAIApi = require('openai');

const openai = new OpenAIApi.OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store in .env
});


router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are AfriVest AI, a helpful investing assistant for Africa-based users.' },
        { role: 'user', content: message },
      ],
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: 'AI failed' });
  }
});

module.exports = router;
