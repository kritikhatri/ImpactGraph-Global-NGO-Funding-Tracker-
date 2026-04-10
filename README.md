🌏 GlobalMetrics: International Data Insight Portal
📌 Overview

GlobalMetrics is a dynamic web application designed to explore and analyze global country data in an intuitive and interactive way. It transforms complex public datasets into meaningful insights through efficient data handling, modern UI design, and real-time interactivity.

The platform enables users to search, filter, sort, and bookmark country-specific data, making it a powerful tool for understanding global demographics and socio-economic indicators.

🚀 Features
🔍 Contextual Search

Real-time search functionality for countries and capitals

Implemented using JavaScript .filter() for fast and efficient results

🌐 Regional Segmentation

Filter countries by region and sub-region

Helps users focus on specific geographic areas

📊 Demographic Sorting

Sort countries by:

Population (ascending/descending)

Alphabetical order

Implemented using .sort() for dynamic data organization

⭐ Bookmarks & Persistence

Save favorite countries using Local Storage

Data persists across browser sessions

📡 API Integration

API Used: REST Countries API

Endpoint: https://restcountries.com/

Data Fetching: ES6 fetch() API

Approach: Asynchronous data handling to ensure non-blocking UI

📦 Data Retrieved

Country Name

ISO Codes

Population

Currency

Region & Sub-region

Geographic Coordinates

🛠️ Tech Stack
Technology	Usage
HTML5	Semantic structure
CSS3	Responsive design (Flexbox & Grid)
JavaScript (ES6+)	Core logic & API handling
Local Storage	Data persistence
⚙️ Project Structure
/globalmetrics
│
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive layout
├── app.js          # Core logic and API integration
└── README.md       # Project documentation
💡 Key Concepts Implemented

Higher-Order Functions (map, filter, sort)

Asynchronous JavaScript (fetch, async/await)

DOM Manipulation

Local Storage API

Responsive Web Design

⚡ Performance Optimization

Efficient DOM updates for faster rendering

Optimized API calls for reduced load time

Clean and modular code structure

Improved Time to Interactive (TTI)

🧠 Best Practices Followed

DRY (Don't Repeat Yourself) principle

Clean and readable code conventions

Modular file structure

Separation of Concerns
