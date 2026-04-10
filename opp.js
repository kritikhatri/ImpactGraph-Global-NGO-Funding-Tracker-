let allMeals = []; 
const mealGrid = document.getElementById('mealGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterCategory = document.getElementById('filterCategory');
const sortOrder = document.getElementById('sortOrder');
const darkModeToggle = document.getElementById('darkModeToggle');
const randomBtn = document.getElementById('randomBtn');
const filterArea = document.getElementById('filterArea');
const emptyState = document.getElementById('emptyState');
const recipeModal = document.getElementById('recipeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalBody = document.getElementById('modalBody');

let favorites = JSON.parse(localStorage.getItem('gastroFavs')) || [];
let shoppingList = JSON.parse(localStorage.getItem('gastroShopping')) || {};

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-theme');
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});

async function fetchAreas() {
    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const data = await res.json();
        const areas = data.meals || [];
        filterArea.innerHTML = '<option value="All">All Areas</option>' + 
            areas.map(a => `<option value="${a.strArea}">${a.strArea}</option>`).join('');
    } catch(e) { console.error('Failed to load areas', e); }
}
fetchAreas();


async function fetchMeals(query = 'a') {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    
    mealGrid.innerHTML = Array(8).fill('<div class="skeleton"></div>').join('');
    emptyState.classList.add('hidden');
    mealGrid.classList.remove('hidden');

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
    const area = filterArea.value;

    let processedMeals = [...allMeals];
    
    if (category !== "All") {
        processedMeals = processedMeals.filter(meal => meal.strCategory === category);
    }
    if (area !== "All") {
        processedMeals = processedMeals.filter(meal => meal.strArea === area);
    }
    if (sortValue === "asc") {
        processedMeals.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } else if (sortValue === "desc") {
        processedMeals.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
    }

    displayMeals(processedMeals);
    updateStats(processedMeals);
}

function displayMeals(meals) {
    if (meals.length === 0) {
        mealGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    mealGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    mealGrid.innerHTML = meals.map(meal => {
        const isFav = favorites.includes(meal.idMeal);
        return `
            <div class="meal-card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info">
                    <h3>${meal.strMeal}</h3>
                    <div class="tags">
                        <span class="tag">${meal.strArea}</span>
                        <span class="tag category">${meal.strCategory}</span>
                    </div>
                    <button class="view-btn" onclick="openRecipeModal('${meal.idMeal}')">View Recipe</button>
                    <button class="fav-btn ${isFav ? 'active' : ''}" 
                            onclick="toggleFavorite('${meal.idMeal}')">
                        ${isFav ? '❤️ Saved' : '🤍 Save to Tracker'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStats(meals) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.innerText = `Showing ${meals.length} culinary records`;
    }

    const totalMealsEl = document.getElementById('totalMealsStat');
    const totalFavsEl = document.getElementById('totalFavsStat');
    const popRegionEl = document.getElementById('popularRegionStat');

    if(totalMealsEl) totalMealsEl.innerText = meals.length;
    if(totalFavsEl) totalFavsEl.innerText = favorites.length;

    if (meals.length > 0 && popRegionEl) {
        const regions = {};
        let maxCount = 0;
        let popRegion = 'N/A';
        meals.forEach(m => {
            if(m.strArea) {
                regions[m.strArea] = (regions[m.strArea] || 0) + 1;
                if(regions[m.strArea] > maxCount) {
                    maxCount = regions[m.strArea];
                    popRegion = m.strArea;
                }
            }
        });
        popRegionEl.innerText = popRegion;
    } else if (popRegionEl) {
        popRegionEl.innerText = 'N/A';
    }
}

let debounceTimer;
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchMeals(searchInput.value || 'a');
    }, 500);
});

searchBtn.addEventListener('click', () => fetchMeals(searchInput.value || 'a'));

randomBtn.addEventListener('click', async () => {
    searchInput.value = '';
    mealGrid.innerHTML = Array(4).fill('<div class="skeleton"></div>').join('');
    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await res.json();
        allMeals = data.meals || [];
        filterCategory.value = 'All';
        filterArea.value = 'All';
        applyInteractions();
    } catch (e) {
        console.error(e);
    }
});

filterCategory.addEventListener('change', applyInteractions);
filterArea.addEventListener('change', applyInteractions);
sortOrder.addEventListener('change', applyInteractions);

document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    filterCategory.value = 'All';
    filterArea.value = 'All';
    searchInput.value = '';
    fetchMeals();
});

fetchMeals();

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('gastroFavs', JSON.stringify(favorites));
    applyInteractions(); 
}

window.openRecipeModal = (id) => {
    const meal = allMeals.find(m => m.idMeal === id);
    if(!meal) return;
    
    let ingredientsHTML = '';
    for(let i=1; i<=20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];
        if(ing && ing.trim()) {
            const isChecked = shoppingList[id] && shoppingList[id].includes(ing);
            ingredientsHTML += `
                <label class="ingredient-item ${isChecked ? 'checked' : ''}">
                    <input type="checkbox" onchange="toggleIngredient('${id}', '${ing.replace(/'/g, "\\'")}', this)" ${isChecked ? 'checked' : ''}>
                    ${meas} ${ing}
                </label>
            `;
        }
    }

    let youtubeEmbed = '';
    if(meal.strYoutube) {
        const videoId = meal.strYoutube.split('v=')[1];
        if(videoId) {
            youtubeEmbed = `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>`;
        }
    }

    modalBody.innerHTML = `
        <h2>${meal.strMeal}</h2>
        ${youtubeEmbed}
        <h3>Ingredients Tracker</h3>
        <div class="ingredients-grid">
            ${ingredientsHTML}
        </div>
        <h3>Instructions</h3>
        <p>${meal.strInstructions.replace(/\r\n/g, '<br>')}</p>
    `;
    recipeModal.classList.remove('hidden');
};

window.toggleIngredient = (mealId, ingredient, checkboxEl) => {
    if(!shoppingList[mealId]) shoppingList[mealId] = [];
    
    if(checkboxEl.checked) {
        shoppingList[mealId].push(ingredient);
        checkboxEl.parentElement.classList.add('checked');
    } else {
        shoppingList[mealId] = shoppingList[mealId].filter(i => i !== ingredient);
        checkboxEl.parentElement.classList.remove('checked');
    }
    localStorage.setItem('gastroShopping', JSON.stringify(shoppingList));
};

closeModalBtn.addEventListener('click', () => recipeModal.classList.add('hidden'));
recipeModal.addEventListener('click', (e) => {
    if(e.target === recipeModal) recipeModal.classList.add('hidden');
});