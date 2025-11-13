# Guide de Déploiement - SmartAgriCongo

## ⚠️ Important : Netlify ne supporte pas Flask directement

Netlify est conçu pour les sites statiques et les fonctions serverless. Votre application Flask nécessite un serveur Python qui tourne en continu, ce que Netlify ne peut pas fournir.

## Solutions recommandées

### Option 1 : Render (Recommandé) ⭐

**Avantages :**
- Gratuit pour commencer
- Support Flask natif
- Déploiement automatique depuis GitHub
- Variables d'environnement faciles à configurer

**Étapes de déploiement :**

1. **Préparer le projet :**
   ```bash
   # Créer un fichier render.yaml (optionnel)
   # Créer un fichier Procfile
   ```

2. **Créer un compte sur Render :**
   - Allez sur https://render.com
   - Connectez votre compte GitHub

3. **Créer un nouveau Web Service :**
   - Sélectionnez votre repository
   - Configuration :
     - **Build Command :** `pip install -r requirements.txt`
     - **Start Command :** `gunicorn app:app`
     - **Environment :** Python 3

4. **Configurer les variables d'environnement :**
   - `OPENAI_API_KEY` : Votre clé OpenAI
   - `FIREBASE_SERVICE_ACCOUNT_KEY` : Le contenu JSON de votre clé Firebase (ou utiliser un fichier)

5. **Déployer :**
   - Render déploiera automatiquement votre application

### Option 2 : Railway

**Avantages :**
- Gratuit pour commencer
- Support Flask
- Déploiement simple

**Étapes :**

1. Créer un compte sur https://railway.app
2. Connecter votre repository GitHub
3. Railway détectera automatiquement Flask
4. Configurer les variables d'environnement
5. Déployer

### Option 3 : Heroku

**Étapes :**

1. Installer Heroku CLI
2. Créer un compte Heroku
3. Créer un fichier `Procfile` :
   ```
   web: gunicorn app:app
   ```
4. Déployer :
   ```bash
   heroku create votre-app-name
   git push heroku main
   ```

## Fichiers nécessaires pour le déploiement

### 1. Procfile (pour Render/Heroku)
```
web: gunicorn app:app --bind 0.0.0.0:$PORT
```

### 2. runtime.txt (optionnel, pour spécifier la version Python)
```
python-3.10.12
```

### 3. .gitignore (s'assurer qu'il contient)
```
.env
serviceAccountKey.json
__pycache__/
*.pyc
.venv/
venv/
flask_session/
```

## Configuration des variables d'environnement

Sur la plateforme de déploiement, configurez :

- `OPENAI_API_KEY` : Votre clé API OpenAI
- `FIREBASE_SERVICE_ACCOUNT_KEY` : Le chemin ou le contenu JSON de votre clé Firebase
- `FLASK_ENV` : `production`
- `FLASK_DEBUG` : `False`

## Notes importantes

1. **Firebase :** Vous devrez uploader votre `serviceAccountKey.json` ou utiliser les variables d'environnement
2. **Gunicorn :** Nécessaire pour la production (ajoutez-le à requirements.txt)
3. **Port :** Les plateformes définissent le port via la variable `PORT`
4. **Static files :** Assurez-vous que les fichiers statiques sont bien servis

## Mise à jour de requirements.txt pour la production

Ajoutez :
```
gunicorn>=21.2.0
```

## Si vous voulez vraiment utiliser Netlify

Vous devriez :
1. Séparer le frontend (HTML/CSS/JS) du backend
2. Convertir les routes Flask en Netlify Functions
3. Utiliser Firebase Client SDK au lieu de Admin SDK
4. Refactoriser complètement l'architecture

C'est un travail important qui nécessite une refonte majeure.

## Support

Pour toute question sur le déploiement, consultez la documentation de la plateforme choisie.

