function RecipeCard({ recipe, saved, onSave }) {
  return (
    <div className="recipe-card">
      <h2>{recipe.title}</h2>
      <p className="description">{recipe.description}</p>
      <p className="time">Time: {recipe.cookingTime}</p>

      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Steps</h3>
      <ol>
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      <button onClick={() => onSave(recipe)} disabled={saved}>
        {saved ? 'Saved' : 'Save Recipe'}
      </button>
    </div>
  );
}

export default RecipeCard;
