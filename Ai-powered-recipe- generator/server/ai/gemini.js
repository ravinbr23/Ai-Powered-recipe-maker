const { GoogleGenAI } = require('@google/genai');

// This is the shape we want back from Gemini.
// Gemini will follow it and give us proper JSON instead of plain text.
const recipeFormat = {
  type: 'object',
  properties: {
    recipes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          cookingTime: { type: 'string' },
          ingredients: { type: 'array', items: { type: 'string' } },
          steps: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'description', 'cookingTime', 'ingredients', 'steps'],
      },
    },
  },
  required: ['recipes'],
};

async function getRecipesFromAI(ingredients) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in the .env file');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `I have these ingredients at home: ${ingredients}.
Suggest 3 different recipes I can cook mostly using these ingredients.
You can assume I also have basic things like salt, pepper, oil, water and common spices.
Keep the recipes simple enough for a home cook.
For each recipe give a title, a one line description, the total cooking time,
the ingredients with amounts, and clear step by step instructions.`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: recipeFormat,
    },
  });

  const data = JSON.parse(response.text);
  return data.recipes;
}

module.exports = { getRecipesFromAI };
