import React from 'react';
import RecipePage from './components/recipe-page';
import AllRecipesPage from './components/all-recipes-page';
import SelectedRecipesPage from './components/selected-recipes-page';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const App: React.FC = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllRecipesPage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/selected" element={<SelectedRecipesPage />}/>
      </Routes>
    </BrowserRouter>
)

export default App;
