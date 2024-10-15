import React, { useEffect, useState } from "react";
import Pagination from "./pagination";
import '../App.css';
import { useLocation } from 'react-router-dom';

interface Meal {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    [key: string]: string | undefined; 
}
  
interface RecipeData {
    meals: Meal[];
}

function SelectedRecipesPage() {
    const location = useLocation();
    const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [combinedIngredients, setCombinedIngredients] = useState<{ [key: string]: { amount: number; measure: string } }>({}); // Initialize combined ingredients state

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { ids } = location.state as { ids: string[] }; 
                const allMeals: Meal[] = []; 
                console.log(ids); 
                
                for (const id of ids) { 
                    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, {
                        method: 'GET'
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    if (data && data.meals) {
                        allMeals.push(...data.meals); 
                    }        
                }
                console.log(allMeals); 
                setRecipeData({ meals: allMeals }); 
            } catch (error) {
                console.error('Error fetching recipe information:', error);
            }  
        };
        fetchRecipes();
    }, [location.state]); 
    
    useEffect(() => {
        if (recipeData) {
            const ingredients = combineIngredients(recipeData.meals);
            setCombinedIngredients(ingredients); 
        }
    }, [recipeData]);

    const combineIngredients = (meals: Meal[]) => {
        const combined: { [key: string]: { amount: number; measure: string } } = {};
    
        meals.forEach((meal) => {
            if (meal) {
                for (let i = 1; i <= 20; i++) { 
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if (ingredient) {
                        if (!combined[ingredient]) {
                            combined[ingredient] = { amount: 0, measure: measure || '' };
                        }
                        combined[ingredient].amount += 1; 
                    }
                }
            }
        });
    
        return combined;
    };
    
    const totalPages = recipeData ? Math.ceil(recipeData.meals.length / itemsPerPage) : 0;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const cleanInstructions = (instructions: string): string => {
        let cleanedInstructions = instructions.replace(/\\u00b0/g, '°');
        cleanedInstructions = cleanedInstructions.replace(/(\r\n|\n|\r)/g, '<br/>');
        return cleanedInstructions;
    };

    const indexOfLastRecipe = currentPage * itemsPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
    const currentRecipes = recipeData ? recipeData.meals.slice(indexOfFirstRecipe, indexOfLastRecipe) : [];

    return (
        <div className="AllRecipes">
            <h1>Selected Recipes</h1>
            <div className="container">
                <div>
                    <div>
                        {currentRecipes.length > 0 ? (
                            currentRecipes.map((meal, index) => (
                                <div key={index} className="RecipeInList">
                                    <img src={meal.strMealThumb} alt={meal.idMeal} className="recipe-small-image" />
                                    <div className="recipe-small-details">
                                        <p id="name">{meal.strMeal}</p>
                                        <p id="category">Category: {meal.strCategory}</p>
                                        <p id="area">Area: {meal.strArea}</p>
                                        <p id="instructions" dangerouslySetInnerHTML={{ __html: cleanInstructions(meal.strInstructions) }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">No results found</p>
                        )}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
                <div className="IngredientsInList">
                    <h2>Combined Ingredients</h2>
                    {Object.entries(combinedIngredients).length > 0 ? (
                        <ul>
                            {Object.entries(combinedIngredients).map(([ingredient, { amount, measure }]) => (
                                <li key={ingredient}>
                                    {ingredient}: {amount} {measure}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No ingredients found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SelectedRecipesPage;
