import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from './components/RecipeCard';
import SavedRecipes from './components/SavedRecipes';
import './App.css';

const API_URL = 'http://localhost:5000/api/recipes';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  async function loadSavedRecipes() {
    try {
      const response = await axios.get(`${API_URL}/saved`);
      setSavedRecipes(response.data);
    } catch (err) {
      console.log('Could not load saved recipes', err);
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();

    if (ingredients.trim() === '') {
      setError('Please type some ingredients first');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      const response = await axios.post(`${API_URL}/generate`, { ingredients });
      setRecipes(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Cannot reach the server. Is the backend running?');
      }
    }

    setLoading(false);
  }

  async function handleSave(recipe) {
    try {
      await axios.post(`${API_URL}/saved`, recipe);
      loadSavedRecipes();
    } catch (err) {
      alert(err.response ? err.response.data.message : 'Could not save the recipe');
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`${API_URL}/saved/${id}`);
      setSavedRecipes(savedRecipes.filter((recipe) => recipe.id !== id));
    } catch (err) {
      console.log(err);
      alert('Could not delete the recipe');
    }
  }

  function isSaved(title) {
    return savedRecipes.some((recipe) => recipe.title === title);
  }

  return (
    <div className="container">
      <h1>AI Recipe Generator</h1>
      <p className="subtitle">Type the ingredients you have at home and get recipe ideas.</p>

      <form className="search-form" onSubmit={handleGenerate}>
        <input
          type="text"
          placeholder="e.g. eggs, rice, onion, tomato"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Get Recipes'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="info">Asking Gemini for ideas, this can take a few seconds...</p>}

      <div className="recipe-list">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            recipe={recipe}
            saved={isSaved(recipe.title)}
            onSave={handleSave}
          />
        ))}
      </div>

      <SavedRecipes recipes={savedRecipes} onDelete={handleDelete} />
    </div>
  );
}

export default App;
