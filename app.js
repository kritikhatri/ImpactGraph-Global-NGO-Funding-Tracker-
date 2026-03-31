
const mealGrid = document.getElementById('mealGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

async function fetchMeals(query = 'a') {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMeals(data.meals);
    } catch (error) {
        console.error("Error fetching data:", error);
        mealGrid.innerHTML = `<p class="error">Failed to load data. Please check your connection.</p>`;
    }
}


function displayMeals(meals) {
    if (!meals) {
        mealGrid.innerHTML = `<p>No results found. Try another search.</p>`;
        return;
    }

    
    const mealHTML = meals.map(meal => `
        <div class="meal-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="meal-info">
                <h3>${meal.strMeal}</h3>
                <span class="tag">${meal.strArea}</span>
                <span class="tag">${meal.strCategory}</span>
            </div>
        </div>
    `).join('');

    mealGrid.innerHTML = mealHTML;
}


searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    fetchMeals(query);
});


fetchMeals();
