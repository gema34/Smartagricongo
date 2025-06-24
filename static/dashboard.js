// Fonction pour basculer un sous-menu
function toggleSubmenu(menuId) {
    const submenu = document.getElementById(menuId);
    if (!submenu) return;
    
    const button = submenu.previousElementSibling;
    
    document.querySelectorAll('.submenu').forEach(menu => {
        if (menu.id !== menuId) {
            menu.classList.remove('active');
            if (menu.previousElementSibling) {
                menu.previousElementSibling.classList.remove('active');
            }
        }
    });

    submenu.classList.toggle('active');
    if (button) button.classList.toggle('active');
}

// Basculer l'affichage de la sidebar (mobile)
function toggleSidebar() {
    document.querySelector('.sidebar')?.classList.toggle('active');
}

// Créer le bouton menu mobile dynamiquement
const createMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    const topBar = document.querySelector('.top-bar');
    if (!sidebar || !topBar) return;

    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    topBar.prepend(mobileMenuBtn);

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mobileMenuBtn.innerHTML = sidebar.classList.contains('active') 
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
};

// Initialise le dashboard après chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    // Bouton menu mobile
    if (window.innerWidth <= 1024) {
        createMobileMenu();
    }

    // Bouton pour basculer la sidebar
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    // Fermer les sous-menus en cliquant à l’extérieur
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.nav-item')) {
            document.querySelectorAll('.submenu').forEach(menu => {
                menu.classList.remove('active');
                if (menu.previousElementSibling) {
                    menu.previousElementSibling.classList.remove('active');
                }
            });
        }
    });

    // ===================== GRAPHIQUE DE RENDEMENT =====================
    const yieldCanvas = document.getElementById('yieldChart');
    if (yieldCanvas) {
        const yieldCtx = yieldCanvas.getContext('2d');
        new Chart(yieldCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                datasets: [
                    {
                        label: 'Manioc',
                        data: [65, 70, 75, 80, 85, 90],
                        borderColor: '#2ecc71',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Maïs',
                        data: [60, 65, 70, 75, 80, 85],
                        borderColor: '#f1c40f',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Bananes',
                        data: [70, 75, 80, 85, 90, 95],
                        borderColor: '#e74c3c',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
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
    }

    // ===================== GRAPHIQUE METEO =====================
    const weatherCanvas = document.getElementById('weatherChart');
    if (weatherCanvas) {
        const weatherCtx = weatherCanvas.getContext('2d');
        new Chart(weatherCtx, {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                datasets: [
                    {
                        label: 'Humidité (%)',
                        data: [65, 70, 75, 80, 75, 70, 65],
                        backgroundColor: '#3498db',
                        borderRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
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
    }
});

// ===================== NOTIFICATIONS =====================
const notifications = document.querySelector('.notifications');
if (notifications) {
    notifications.addEventListener('click', () => {
        alert('Fonctionnalité de notifications à implémenter');
    });
}

// ===================== DECONNEXION =====================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            window.location.href = 'login.html';
        }
    });
}

// ===================== BARRE DE RECHERCHE =====================
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        console.log('Recherche :', e.target.value);
    });
}

// ===================== STATISTIQUES TEMPS RÉEL =====================
function updateStats() {
    const stats = {
        crops: Math.floor(Math.random() * 10) + 1,
        yield: Math.floor(Math.random() * 20) + 80,
        temperature: Math.floor(Math.random() * 5) + 25,
        humidity: Math.floor(Math.random() * 10) + 60
    };

    const statElements = document.querySelectorAll('.stat-card .stat-info h3');
    if (statElements.length >= 4) {
        statElements[0].textContent = stats.crops;
        statElements[1].textContent = stats.yield + '%';
        statElements[2].textContent = stats.temperature + '°C';
        statElements[3].textContent = stats.humidity + '%';
    }
}
setInterval(updateStats, 5000);

// ===================== MENU NAVIGATION =====================
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('href')?.substring(1);

        // Mise à jour du menu actif
        document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
        e.currentTarget.parentElement?.classList.add('active');

        // Affichage console (à remplacer par du routage AJAX si nécessaire)
        console.log('Navigation vers :', target);
    });
});
