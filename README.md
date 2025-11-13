# SmartAgriCongo - Plateforme d'Agriculture Intelligente

![SmartAgriCongo Logo](images/logo.png)

## Description

SmartAgriCongo est une plateforme innovante dédiée à l'agriculture intelligente en République du Congo. Elle vise à moderniser l'agriculture locale en utilisant la technologie pour améliorer les rendements et faciliter la commercialisation des produits agricoles.

## Fonctionnalités Principales

### 🌱 Gestion des Cultures
- Suivi en temps réel des cultures
- Alertes météorologiques
- Recommandations d'irrigation
- Analyse des rendements

### 📊 Tableau de Bord
- Statistiques en temps réel
- Graphiques de performance
- Suivi des activités
- Alertes et notifications

### 🛒 Marketplace
- Vente directe des produits
- Système de commande en ligne
- Suivi des transactions
- Évaluation des vendeurs

### 🌤️ Météo et Capteurs
- Prévisions météorologiques
- Données des capteurs IoT
- Alertes climatiques
- Historique des conditions

## Technologies Utilisées

- **Frontend**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Chart.js pour les graphiques
  - Font Awesome pour les icônes

- **Backend**
  - Python 3.7+
  - Flask (framework web)
  - Firebase Firestore (base de données)
  - Firebase Admin SDK
  - Werkzeug (hachage de mots de passe)
  - OpenWeatherMap API (météo)

## Prérequis

- Python 3.7 ou supérieur
- pip (gestionnaire de paquets Python)
- Un compte Firebase (gratuit)
- Clé API OpenWeatherMap (optionnel, pour les fonctionnalités météo)

## Installation

### 1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/smartagricongo.git
cd smartagricongo
```

### 2. Créez un environnement virtuel (recommandé) :
```bash
python3 -m venv venv
source venv/bin/activate  # Sur Linux/Mac
# ou
venv\Scripts\activate  # Sur Windows
```

### 3. Installez les dépendances Python :
```bash
pip install -r requirements.txt
```

### 4. Configurez Firebase :

**⚠️ IMPORTANT :** Consultez le fichier [FIREBASE_SETUP.md](FIREBASE_SETUP.md) pour les instructions détaillées de configuration Firebase.

Résumé rapide :
1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez Firestore Database
3. Téléchargez la clé de service (`serviceAccountKey.json`)
4. Placez le fichier `serviceAccountKey.json` à la racine du projet

### 5. Lancez l'application :
```bash
python app.py
```

### 6. Ouvrez votre navigateur et accédez à :
```
http://localhost:5000
```

## Structure du Projet

```
smartagricongo/
├── app.py                 # Application Flask principale
├── firebase_config.py     # Configuration Firebase
├── requirements.txt       # Dépendances Python
├── FIREBASE_SETUP.md      # Guide de configuration Firebase
├── templates/             # Templates HTML
│   ├── index.html         # Page d'accueil
│   ├── login.html         # Page de connexion
│   ├── register.html      # Page d'inscription
│   ├── dashboard.html     # Tableau de bord
│   └── 404.html           # Page d'erreur 404
├── static/                # Fichiers statiques
│   ├── styles.css         # Styles globaux
│   ├── auth.css           # Styles d'authentification
│   ├── dashboard.css      # Styles du tableau de bord
│   ├── script.js          # Script principal
│   ├── auth.js            # Script d'authentification
│   ├── dashboard.js       # Script du tableau de bord
│   ├── images/            # Images
│   └── uploads/           # Photos de profil uploadées
└── serviceAccountKey.json # Clé Firebase (à ajouter, non versionnée)
```

## Configuration Firebase

Pour plus de détails sur la configuration Firebase, consultez le fichier [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

**Note importante :** Le fichier `serviceAccountKey.json` ne doit jamais être commité dans le dépôt Git. Il est déjà inclus dans `.gitignore`.

## Captures d'Écran

### Page d'Accueil
![Page d'Accueil](screenshots/home.png)

### Tableau de Bord
![Tableau de Bord](screenshots/dashboard.png)

### Marketplace
![Marketplace](screenshots/marketplace.png)

## Fonctionnalités à Implémenter

- [ ] Système de paiement en ligne
- [ ] Application mobile
- [ ] Intégration de l'IA pour les prédictions
- [ ] Système de chat en temps réel
- [ ] Export des données en PDF/Excel

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## Contact

- **Porteur du Projet** : NDOUMBA-MBOUBA Duvet Gema
- **Email** : contact@smartagricongo.com
- **Site Web** : www.smartagricongo.com

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Remerciements

- Tous les contributeurs du projet
- La communauté open source
- Les agriculteurs congolais pour leur inspiration 