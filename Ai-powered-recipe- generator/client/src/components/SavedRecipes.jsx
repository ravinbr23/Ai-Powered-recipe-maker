function SavedRecipes({ recipes, onDelete }) {
  return (
    <div className="saved-section">
      <h2>My Saved Recipes ({recipes.length})</h2>

      {recipes.length === 0 && <p className="info">You have not saved any recipes yet.</p>}

      {recipes.map((recipe) => (
        <details key={recipe.id} className="saved-recipe">
          <summary>
            {recipe.title} <span className="time">({recipe.cookingTime})</span>
          </summary>

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

          <button className="delete-btn" onClick={() => onDelete(recipe.id)}>
            Delete
          </button>
        </details>
      ))}
    </div>
  );
}

export default SavedRecipes;
