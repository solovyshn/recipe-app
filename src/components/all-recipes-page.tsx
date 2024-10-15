import React, { useEffect, useState } from "react";
import Pagination from "./pagination";
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

interface Category {
    strCategory: string;
}

interface Area {
    strArea: string;
}

function AllRecipesPage() {
    const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedRecipeIds, setSelectedRecipeIds] = useState<Set<string>>(new Set());
    const [categories, setCategories] = useState<Category[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<string>('');

    const handleRecipeSelect = (id: string) => {
        setSelectedRecipeIds((prev) => {
            const newSelection = new Set(prev);
            if (newSelection.has(id)) {
                newSelection.delete(id); 
            } else {
                newSelection.add(id); 
            }
            return newSelection;
        });
    }; 
    const navigate = useNavigate();

    const goToSelectedPage = () => {
        navigate('/selected', { state: { ids: selectedRecipeIds } });
    };

    const goToRecipePage = (id: string) => {
        navigate(`/recipe/${id}`);
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const allMeals: Meal[] = []; 
                const alphabet: string[] = Array.from(Array(26)).map((_, index) => String.fromCharCode(index + 65));
                for (const key in alphabet) {
                    if (Object.prototype.hasOwnProperty.call(alphabet, key)) {
                        const element = alphabet[key];
                        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${element}`, {
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
                }
                console.log(allMeals)
                setRecipeData({ meals: allMeals }); 
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } 
        } 
        const fetchCategories = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`, {
                    method: 'GET'
                });
                const data = await response.json();
                setCategories(data.meals);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
    
        const fetchAreas = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`, {
                    method: 'GET'
                });
                const data = await response.json();
                setAreas(data.meals);
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        };
        fetchRecipes();
        fetchCategories();
        fetchAreas();
    }, []);

    const filteredRecipes = recipeData?.meals.filter((meal) => {
        const matchesCategory = selectedCategory ? meal.strCategory === selectedCategory : true;
        const matchesArea = selectedArea ? meal.strArea === selectedArea : true;
        const matchesSearch = meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesArea && matchesSearch;
    }) || [];

    const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastRecipe = currentPage * itemsPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
      
    return (
        <div className="AllRecipes">
            <div className="search">
                <input className="search-input" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for recipes..."/>
                {selectedRecipeIds.size>0 ? (<button className="selected-recipes-btn" onClick={goToSelectedPage}>See selected recipes</button>):(<span></span>)}
                <select value={selectedCategory} className="filter-dropdown" onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category.strCategory}>
                            {category.strCategory}
                        </option>
                    ))}
                </select>
                <select value={selectedArea} className="filter-dropdown" onChange={(e) => setSelectedArea(e.target.value)}>
                    <option value="">All Areas</option>
                    {areas.map((area, index) => (
                        <option key={index} value={area.strArea}>
                            {area.strArea}
                        </option>
                    ))}
                </select>
            </div>
                <div className="container">
                    {currentRecipes ? (
                        currentRecipes.map((meal, index) => (
                            <div key={index} className="RecipeInList">
                                <input type="checkbox" checked={selectedRecipeIds.has(meal.idMeal)} onChange={() => handleRecipeSelect(meal.idMeal)}/>
                                <span className="RecipeInListDetails" onClick={() => goToRecipePage(meal.idMeal)}>
                                    <img src={currentRecipes[index].strMealThumb} alt={currentRecipes[index].idMeal} className="recipe-small-image"></img>
                                    <div className="recipe-small-details">
                                        <p id="name">{currentRecipes[index].strMeal}</p>
                                        <p id="category">Category: {currentRecipes[index].strCategory}</p>
                                        <p id="area"></p>Area: {currentRecipes[index].strArea}
                                    </div>
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">No results found</p>
                    )}
                </div>
            <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
        </div>
    )
}

export default AllRecipesPage;