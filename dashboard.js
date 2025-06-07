// Function to toggle submenu
function toggleSubmenu(menuId) {
    const submenu = document.getElementById(menuId);
    const button = submenu.previousElementSibling;
    
    // Close all other submenus
    document.querySelectorAll('.submenu').forEach(menu => {
        if (menu.id !== menuId) {
            menu.classList.remove('active');
            menu.previousElementSibling.classList.remove('active');
        }
    });
    
    // Toggle current submenu
    submenu.classList.toggle('active');
    button.classList.toggle('active');
}

// Toggle sidebar on mobile
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to menu toggle button
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close submenus when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-item')) {
            document.querySelectorAll('.submenu').forEach(menu => {
                menu.classList.remove('active');
                menu.previousElementSibling.classList.remove('active');
            });
        }
    });

    // Graphique de rendement des cultures
    const yieldCtx = document.getElementById('yieldChart').getContext('2d');
    new Chart(yieldCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
            datasets: [{
                label: 'Manioc',
                data: [65, 70, 75, 80, 85, 90],
                borderColor: '#2ecc71',
                tension: 0.4,
                fill: false
            }, {
                label: 'Maïs',
                data: [60, 65, 70, 75, 80, 85],
                borderColor: '#f1c40f',
                tension: 0.4,
                fill: false
            }, {
                label: 'Bananes',
                data: [70, 75, 80, 85, 90, 95],
                borderColor: '#e74c3c',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Rendement des cultures (%)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Graphique des conditions météorologiques
    const weatherCtx = document.getElementById('weatherChart').getContext('2d');
    new Chart(weatherCtx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{
                label: 'Température (°C)',
                data: [28, 29, 30, 28, 27, 26, 25],
                backgroundColor: '#e74c3c',
                borderRadius: 5
            }, {
                label: 'Humidité (%)',
                data: [65, 70, 75, 80, 75, 70, 65],
                backgroundColor: '#3498db',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Conditions météorologiques'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

// Gestion du menu mobile
const createMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    document.querySelector('.top-bar').prepend(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mobileMenuBtn.innerHTML = sidebar.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });
};

// Initialiser le menu mobile pour les petits écrans
if (window.innerWidth <= 1024) {
    createMobileMenu();
}

// Gestion des notifications
const notifications = document.querySelector('.notifications');
if (notifications) {
    notifications.addEventListener('click', () => {
        // Ici, vous pouvez ajouter la logique pour afficher les notifications
        alert('Fonctionnalité de notifications à implémenter');
    });
}

// Gestion de la déconnexion
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            window.location.href = 'login.html';
        }
    });
}

// Gestion de la recherche
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        // Ici, vous pouvez ajouter la logique de recherche
        console.log('Recherche:', e.target.value);
    });
}

// Mise à jour des statistiques en temps réel
function updateStats() {
    // Simuler des mises à jour de données
    const stats = {
        crops: Math.floor(Math.random() * 10) + 1,
        yield: Math.floor(Math.random() * 20) + 80,
        temperature: Math.floor(Math.random() * 5) + 25,
        humidity: Math.floor(Math.random() * 10) + 60
    };

    // Mettre à jour les valeurs affichées
    document.querySelector('.stat-card:nth-child(1) .stat-info h3').textContent = stats.crops;
    document.querySelector('.stat-card:nth-child(2) .stat-info h3').textContent = stats.yield + '%';
    document.querySelector('.stat-card:nth-child(3) .stat-info h3').textContent = stats.temperature + '°C';
    document.querySelector('.stat-card:nth-child(4) .stat-info h3').textContent = stats.humidity + '%';
}

// Mettre à jour les statistiques toutes les 5 secondes
setInterval(updateStats, 5000);

// Gestion des clics sur les éléments du menu
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('href').substring(1);
        
        // Mettre à jour la classe active
        document.querySelectorAll('.sidebar-nav li').forEach(li => {
            li.classList.remove('active');
        });
        e.target.parentElement.classList.add('active');
        
        // Ici, vous pouvez ajouter la logique pour charger le contenu correspondant
        console.log('Navigation vers:', target);
    });
});