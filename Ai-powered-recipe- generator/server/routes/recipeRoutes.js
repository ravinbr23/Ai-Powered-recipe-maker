const express = require('express');
const {
  generateRecipes,
  getSavedRecipes,
  saveRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

const router = express.Router();

router.post('/generate', generateRecipes);
router.get('/saved', getSavedRecipes);
router.post('/saved', saveRecipe);
router.delete('/saved/:id', deleteRecipe);

module.exports = router;
