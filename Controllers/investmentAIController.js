// BACKEND/Controllers/investmentAIController.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getAIRecommendations = async (req, res) => {
  const { goal, riskLevel, timeHorizon, capital } = req.body;

  try {
    const prompt = `
You are a top-tier African investment advisor. Recommend 3 futuristic, impactful, high-potential investments based on:
- Goal: ${goal}
- Risk: ${riskLevel}
- Duration: ${timeHorizon} years
- Capital: $${capital}

Each should include: Name, Sector, ROI, Suggested Amount, and Why it's suitable.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-4o-mini" if preferred
      messages: [
        {
          role: "system",
          content:
            "You are AfriVest's elite AI investment strategist. Respond in professional, investor-friendly formatting.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const answer = response.choices[0].message.content;
    res.json({ recommendations: answer });
  } catch (err) {
    console.error("AI Recommendation Error:", err);
    res.status(500).json({ error: "AI failed to generate recommendations." });
  }
};
