// Météo JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.getElementById('refreshBtn');
    const currentDateEl = document.getElementById('currentDate');
    
    // Afficher la date actuelle
    function updateDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDateEl.textContent = now.toLocaleDateString('fr-FR', options);
    }
    updateDate();

    // Charger les données météo
    function loadWeather() {
        const refreshIcon = refreshBtn.querySelector('i');
        refreshBtn.classList.add('loading');
        
        fetch('/get_weather')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Erreur météo:', data.error);
                    showError('Impossible de charger les données météo');
                    return;
                }

                // Mettre à jour les éléments
                document.getElementById('weatherIcon').src = data.icon;
                document.getElementById('weatherTemp').textContent = Math.round(data.temp);
                document.getElementById('weatherDescription').textContent = data.description;
                document.getElementById('weatherHumidity').textContent = data.humidity;
                document.getElementById('weatherWind').textContent = data.wind;
                document.getElementById('updateTime').textContent = data.updated;

                // Si on a plus de données
                if (data.feels_like) {
                    document.getElementById('weatherFeelsLike').textContent = Math.round(data.feels_like);
                }
                if (data.pressure) {
                    document.getElementById('weatherPressure').textContent = data.pressure;
                }

                // Générer des recommandations
                generateRecommendations(data);
            })
            .catch(err => {
                console.error('Erreur:', err);
                showError('Erreur de connexion');
            })
            .finally(() => {
                refreshBtn.classList.remove('loading');
            });
    }

    // Générer des recommandations basées sur la météo
    function generateRecommendations(data) {
        const recommendations = [];
        const temp = data.temp;
        const humidity = data.humidity;
        const wind = data.wind;

        if (temp > 30) {
            recommendations.push('Température élevée: Augmentez l\'irrigation pour vos cultures');
        } else if (temp < 20) {
            recommendations.push('Température basse: Protégez vos cultures sensibles au froid');
        }

        if (humidity < 50) {
            recommendations.push('Humidité faible: Arrosage recommandé pour maintenir l\'humidité du sol');
        } else if (humidity > 80) {
            recommendations.push('Humidité élevée: Surveillez les risques de maladies fongiques');
        }

        if (wind > 5) {
            recommendations.push('Vent fort: Vérifiez les tuteurs et protections de vos cultures');
        }

        if (temp >= 20 && temp <= 30 && humidity >= 50 && humidity <= 70) {
            recommendations.push('Conditions optimales: Moment idéal pour les activités agricoles');
        }

        // Afficher les recommandations
        const recommendationsList = document.getElementById('recommendationsList');
        if (recommendations.length > 0) {
            recommendationsList.innerHTML = recommendations.map(rec => 
                `<div class="recommendation-item">
                    <i class="fas fa-check-circle"></i>
                    <span>${rec}</span>
                </div>`
            ).join('');
        } else {
            recommendationsList.innerHTML = `
                <div class="recommendation-item">
                    <i class="fas fa-info-circle"></i>
                    <span>Conditions météorologiques normales</span>
                </div>
            `;
        }
    }

    function showError(message) {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = `
            <div class="recommendation-item" style="border-left-color: var(--secondary-color);">
                <i class="fas fa-exclamation-triangle" style="color: var(--secondary-color);"></i>
                <span>${message}</span>
            </div>
        `;
    }

    // Bouton de rafraîchissement
    refreshBtn.addEventListener('click', loadWeather);

    // Charger les données au démarrage
    loadWeather();

    // Actualiser automatiquement toutes les 10 minutes
    setInterval(loadWeather, 600000);
});

