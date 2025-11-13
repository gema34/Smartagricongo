// Marketplace JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const locationFilter = document.getElementById('locationFilter');
    const productsGrid = document.getElementById('productsGrid');
    const productCards = document.querySelectorAll('.product-card');

    // Fonction de filtrage
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const price = priceFilter.value;
        const location = locationFilter.value;

        productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardPrice = card.dataset.price;
            const cardText = card.textContent.toLowerCase();
            const cardLocation = card.querySelector('.product-location').textContent.toLowerCase();

            const matchesSearch = cardText.includes(searchTerm);
            const matchesCategory = category === 'all' || cardCategory === category;
            const matchesPrice = price === 'all' || cardPrice === price;
            const matchesLocation = location === 'all' || cardLocation.includes(location.toLowerCase());

            if (matchesSearch && matchesCategory && matchesPrice && matchesLocation) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Event listeners
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    locationFilter.addEventListener('change', filterProducts);

    // Boutons d'action
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            alert(`Produit "${productName}" ajouté au panier !`);
        });
    });

    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('fa-heart');
                icon.classList.add('fas', 'fa-heart');
                this.style.color = 'var(--secondary-color)';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far', 'fa-heart');
                this.style.color = '';
            }
        });
    });
});

