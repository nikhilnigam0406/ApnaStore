// ========== API Configuration ==========
const API_URL = 'https://fakestoreapi.com/products';
let allProducts = [];
let currentFilter = 'all';

// ========== DOM Elements ==========
const cardsContainer = document.getElementById('cards');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const noResultsElement = document.getElementById('no-results');
const filterButtons = document.querySelectorAll('.filter-btn');

// ========== Event Listeners ==========
filterButtons.forEach(button => {
    button.addEventListener('click', handleFilterClick);
});

// ========== Main Functions ==========
/**
 * Fetch products from API
 */
async function fetchProducts() {
    try {
        loadingElement.style.display = 'block';
        errorElement.classList.remove('show');
        cardsContainer.innerHTML = '';
        noResultsElement.style.display = 'none';

        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        allProducts = await response.json();

        if (allProducts.length === 0) {
            showNoResults();
            return;
        }

        loadingElement.style.display = 'none';
        displayProducts(allProducts);
    } catch (error) {
        handleError(`Failed to load products: ${error.message}`);
        console.error('Fetch error:', error);
    }
}

/**
 * Display products based on filter
 */
function displayProducts(products) {
    cardsContainer.innerHTML = '';
    
    if (products.length === 0) {
        showNoResults();
        return;
    }

    products.forEach(product => {
        const cardElement = createProductCard(product);
        cardsContainer.appendChild(cardElement);
    });

    loadingElement.style.display = 'none';
    noResultsElement.style.display = 'none';
}

/**
 * Create a product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'card';

    const imageUrl = product.image || '';
    const title = product.title || 'Untitled Product';
    const description = product.description || 'No description available';
    const price = product.price ? `$${product.price.toFixed(2)}` : 'Price not available';
    const category = product.category || 'Uncategorized';
    const rating = product.rating?.rate || 'N/A';
    const reviewCount = product.rating?.count || 0;

    card.innerHTML = `
        <div class="card-image-container">
            <img 
                src="${imageUrl}" 
                alt="${title}" 
                class="card-image loading"
                onerror="this.parentElement.innerHTML = '<div class=\"image-error\">Image not available</div>'"
                onload="this.classList.remove('loading')"
            >
        </div>
        <div class="card-content">
            <h2 class="card-title">${escapeHtml(title)}</h2>
            <p class="card-description">${escapeHtml(description)}</p>
            <div class="card-footer">
                <span class="card-category">${escapeHtml(category)}</span>
                <div>
                    <div class="card-price">${price}</div>
                    <div class="card-rating">⭐ ${rating} (${reviewCount})</div>
                </div>
            </div>
        </div>
    `;

    // Add click event for interactivity (optional: can be used for product detail page)
    card.addEventListener('click', () => {
        console.log('Product clicked:', product);
        // You can add a modal or redirect here
    });

    return card;
}

/**
 * Handle filter button clicks
 */
function handleFilterClick(event) {
    const selectedFilter = event.target.dataset.filter;
    
    // Update active button styling
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter and display products
    currentFilter = selectedFilter;
    const filteredProducts = filterProducts(selectedFilter);
    displayProducts(filteredProducts);
}

/**
 * Filter products by category
 */
function filterProducts(filter) {
    if (filter === 'all') {
        return allProducts;
    }
    
    return allProducts.filter(product => 
        product.category.toLowerCase() === filter.toLowerCase()
    );
}

/**
 * Show no results message
 */
function showNoResults() {
    cardsContainer.innerHTML = '';
    loadingElement.style.display = 'none';
    noResultsElement.style.display = 'block';
}





/**
 * Handle and display errors
 */
function handleError(message) {
    loadingElement.style.display = 'none';
    errorElement.textContent = message;
    errorElement.classList.add('show');
    cardsContainer.innerHTML = '';
    console.error('Error:', message);
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize the application
 */
function init() {
    fetchProducts();
}

// ========== Start the application ==========
document.addEventListener('DOMContentLoaded', init);
