import React, { useEffect, useState } from "react";
import '../App.css';
import { useNavigate } from 'react-router-dom';

interface Meal {
    idMeal: string;
    strMeal: string;
    strDrinkAlternate?: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strTags?: string;
    strYoutube: string;
    strIngredient1: string;
    strIngredient2: string;
    strIngredient3: string;
    strIngredient4: string;
    strIngredient5: string;
    strIngredient6: string;
    strIngredient7: string;
    strIngredient8: string;
    strIngredient9: string;
    strIngredient10: string;
    strIngredient11: string;
    strIngredient12: string;
    strIngredient13: string;
    strIngredient14: string;
    strIngredient15: string;
    strIngredient16: string;
    strIngredient17: string;
    strIngredient18: string;
    strIngredient19: string;
    strIngredient20: string;
    strMeasure1: string;
    strMeasure2: string;
    strMeasure3: string;
    strMeasure4: string;
    strMeasure5: string;
    strMeasure6: string;
    strMeasure7: string;
    strMeasure8: string;
    strMeasure9: string;
    strMeasure10: string;
    strMeasure11: string;
    strMeasure12: string;
    strMeasure13: string;
    strMeasure14: string;
    strMeasure15: string;
    strMeasure16: string;
    strMeasure17: string;
    strMeasure18: string;
    strMeasure19: string;
    strMeasure20: string;
    strSource: string;
    strImageSource: string;
    strCreativeCommonsConfirmed?: string;
    dateModified?: string
}
  
interface RecipeData {
    meals: Meal[];
}
  
function RecipePage() {
    const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
    const [ingredients, setIngredients] = useState<{ name: string, measure: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=52893`, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data)
                setRecipeData(data);
                const meal = data.meals[0];
                const ingredientList = [];
                for (let i = 1; i <= 20; i++) {
                  const ingredient = meal[`strIngredient${i}` as keyof Meal];
                  const measure = meal[`strMeasure${i}` as keyof Meal];
                  if (ingredient && ingredient.trim() !== '') {
                    ingredientList.push({ name: ingredient, measure: measure });
                  }
                }
                setIngredients(ingredientList);        
            } catch (error) {
              console.error('Error fetching recipe information:', error);
            }
        };
        fetchRecipe();
    }, []);
          
    const cleanInstructions = (instructions: string): string => {
        let cleanedInstructions = instructions.replace(/\\u00b0/g, '°');
        cleanedInstructions = cleanedInstructions.replace(/(\r\n|\n|\r)/g, '<br/>');
        return cleanedInstructions;
    };

    const goToAllRecipesPage = () => {
        navigate(`/`);
    };

    return (
        <div className="Recipe">
            <header className="">
                <button className="selected-recipes-btn"  onClick={goToAllRecipesPage}>Back</button>
            </header>
            <div className="container">
                { recipeData ? (
                    <div className="recipe-info">
                        <div className="main-info">
                            <img src={recipeData.meals[0].strMealThumb} alt={recipeData.meals[0].idMeal} className="recipe-image"></img>
                            <div className="recipe-details">
                                <span><p id="name">{recipeData.meals[0].strMeal}</p></span>
                                <span><a id="link" href={recipeData.meals[0].strYoutube}>See video</a></span>
                                <span><p id="category">Category: {recipeData.meals[0].strCategory}</p></span>
                                <span><p id="area"></p>Area: {recipeData.meals[0].strArea}</span>
                                <span><p id="tags">{recipeData.meals[0].strTags ? (recipeData.meals[0].strTags) : ("None")}</p></span>
                            </div>
                        </div>
                        <div>
                            <div>
                                {ingredients ? (
                                    ingredients.map((ingredient, index) => (
                                        <div key={index} className="Ingredients">
                                            <p className="ingredient">{ingredient.name}</p>
                                            <span className="measure">{ingredient.measure}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>Problem</p>
                                )}
                            </div>
                            <div>
                                <p id="instructions" dangerouslySetInnerHTML={{ __html: cleanInstructions(recipeData.meals[0].strInstructions) }} />
                            </div>

                        </div>
                    </div>
                ):(
                    <p className="no-data">Loading recipe information...</p>
                )}
            </div>
        </div>
    );
}

export default RecipePage;