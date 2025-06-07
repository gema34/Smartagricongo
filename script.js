// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = '#ffffff';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Mobile menu toggle
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Add mobile menu button to navbar
    navbar.insertBefore(mobileMenuBtn, navLinks);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        mobileMenuBtn.innerHTML = navLinks.style.display === 'flex' ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });
};

// Initialize mobile menu for small screens
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Marketplace preview animation
const marketplacePreview = document.querySelector('.marketplace-preview');
if (marketplacePreview) {
    const products = [
        { 
            name: 'Manioc', 
            price: '5000 FCFA/kg', 
            image: 'images/MANIOC.jpg'
        },
        { 
            name: 'Bananes', 
            price: '5000 FCFA/kg', 
            image: 'images/products/bananes.jpg'
        },
        { 
            name: 'Maïs', 
            price: '3000 FCFA/kg', 
            image: 'images/OIP.jpg'
        }
    ];

    // Create product cards
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>${product.price}</p>
            <button class="buy-btn">Acheter</button>
        `;
        marketplacePreview.appendChild(card);
    });
}

// Form validation for login/register
const validateForm = (form) => {
    const email = form.querySelector('input[type="email"]');
    const password = form.querySelector('input[type="password"]');
    
    if (email && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Veuillez entrer une adresse email valide');
        return false;
    }
    
    if (password && password.value.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        return false;
    }
    
    return true;
};

// Add form validation to login/register buttons
document.querySelectorAll('.login-btn, .register-btn').forEach(button => {
    button.addEventListener('click', () => {
        const formType = button.classList.contains('login-btn') ? 'login' : 'register';
        const form = document.createElement('form');
        form.innerHTML = `
            <div class="form-container">
                <h3>${formType === 'login' ? 'Connexion' : 'Inscription'}</h3>
                <input type="email" placeholder="Email" required>
                <input type="password" placeholder="Mot de passe" required>
                ${formType === 'register' ? '<input type="password" placeholder="Confirmer le mot de passe" required>' : ''}
                <button type="submit">${formType === 'login' ? 'Se connecter' : 'S\'inscrire'}</button>
            </div>
        `;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                // Here you would typically send the form data to your backend
                alert(`${formType === 'login' ? 'Connexion' : 'Inscription'} réussie!`);
                form.remove();
            }
        });
        
        document.body.appendChild(form);
    });
});

// Add hover effects to cards
document.querySelectorAll('.challenge-card, .solution-card, .feature-card, .impact-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
}); 