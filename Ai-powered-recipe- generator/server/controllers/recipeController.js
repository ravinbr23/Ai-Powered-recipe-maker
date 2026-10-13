const fs = require('fs');
const path = require('path');
const { getRecipesFromAI } = require('../ai/gemini');

// saved recipes are kept in a simple JSON file (no database needed)
const savedFile = path.join(__dirname, '..', 'savedRecipes.json');

function readSavedRecipes() {
  if (!fs.existsSync(savedFile)) {
    return [];
  }
  const text = fs.readFileSync(savedFile, 'utf-8');
  return JSON.parse(text);
}

function writeSavedRecipes(recipes) {
  fs.writeFileSync(savedFile, JSON.stringify(recipes, null, 2));
}

// POST /api/recipes/generate
async function generateRecipes(req, res) {
  const ingredients = req.body.ingredients;

  if (typeof ingredients !== 'string' || ingredients.trim() === '') {
    return res.status(400).json({ message: 'Please enter at least one ingredient' });
  }
  if (ingredients.length > 300) {
    return res.status(400).json({ message: 'Ingredient list is too long' });
  }

  try {
    const recipes = await getRecipesFromAI(ingredients);
    res.json(recipes);
  } catch (error) {
    console.log('Gemini error:', error.message);

    if (error.status === 429) {
      return res.status(429).json({ message: 'Free limit reached. Please wait a minute and try again.' });
    }
    res.status(500).json({ message: 'Could not get recipes right now. Please try again.' });
  }
}

// GET /api/recipes/saved
function getSavedRecipes(req, res) {
  const recipes = readSavedRecipes();
  res.json(recipes);
}

// POST /api/recipes/saved
function saveRecipe(req, res) {
  const { title, description, cookingTime, ingredients, steps } = req.body;

  if (!title || !ingredients || !steps) {
    return res.status(400).json({ message: 'Recipe details are missing' });
  }

  const recipes = readSavedRecipes();

  const alreadySaved = recipes.find((recipe) => recipe.title === title);
  if (alreadySaved) {
    return res.status(400).json({ message: 'This recipe is already saved' });
  }

  const newRecipe = {
    id: Date.now().toString(),
    title,
    description,
    cookingTime,
    ingredients,
    steps,
  };

  recipes.push(newRecipe);
  writeSavedRecipes(recipes);
  res.status(201).json(newRecipe);
}

// DELETE /api/recipes/saved/:id
function deleteRecipe(req, res) {
  const recipes = readSavedRecipes();
  const remaining = recipes.filter((recipe) => recipe.id !== req.params.id);

  if (remaining.length === recipes.length) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  writeSavedRecipes(remaining);
  res.json({ message: 'Recipe deleted' });
}

module.exports = { generateRecipes, getSavedRecipes, saveRecipe, deleteRecipe };
