
let allMeals = []; 
const mealGrid = document.getElementById('mealGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterCategory = document.getElementById('filterCategory');
const sortOrder = document.getElementById('sortOrder');


async function fetchMeals(query = 'a') {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
       
        allMeals = data.meals || []; 
        applyInteractions(); 
    } catch (error) {
        console.error("Error fetching data:", error);
        mealGrid.innerHTML = `<p class="error">Failed to load data. Please check your connection.</p>`;
    }
}


function applyInteractions() {
    const category = filterCategory.value;
    const sortValue = sortOrder.value;

    let processedMeals = [...allMeals];
    
    if (category !== "All") {
        processedMeals = processedMeals.filter(meal => meal.strCategory === category);
    }
    if (sortValue === "asc") {
        processedMeals.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } else if (sortValue === "desc") {
        processedMeals.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
    }

    displayMeals(processedMeals);
    updateResultsCount(processedMeals.length);
}

function displayMeals(meals) {
    if (meals.length === 0) {
        mealGrid.innerHTML = `<p>No results match your criteria. Try adjusting filters.</p>`;
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

function updateResultsCount(count) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.innerText = `Showing ${count} culinary records`;
    }
}

searchBtn.addEventListener('click', () => {
    fetchMeals(searchInput.value);
});


filterCategory.addEventListener('change', applyInteractions);


sortOrder.addEventListener('change', applyInteractions);


fetchMeals();
