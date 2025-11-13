# Configuration Firebase pour SmartAgriCongo

Ce guide vous explique comment configurer Firebase pour ce projet.

## Prérequis

1. Un compte Google (pour accéder à Firebase Console)
2. Python 3.7 ou supérieur
3. pip installé

## Étapes de configuration

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet" ou "Add project"
3. Entrez le nom du projet (ex: `smartagricongo`)
4. Suivez les étapes pour créer le projet

### 2. Activer Firestore Database

**⚠️ ÉTAPE CRITIQUE :** Vous devez créer la base de données Firestore avant de pouvoir l'utiliser.

**Méthode 1 : Via Firebase Console (Recommandé)**

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet (`smartagricongpo`)
3. Dans le menu de gauche, cliquez sur **"Firestore Database"** ou **"Firestore"**
4. Cliquez sur **"Créer une base de données"** ou **"Create database"**
5. Choisissez le mode :
   - **Mode "Test"** : Pour le développement (règles permissives, gratuit)
   - **Mode "Production"** : Pour la production (règles strictes)
6. Sélectionnez une **région** (choisissez la plus proche de vos utilisateurs, ex: `europe-west1` pour l'Europe)
7. Cliquez sur **"Activer"** ou **"Enable"**
8. Attendez que la base de données soit créée (quelques secondes)

**Méthode 2 : Via le lien direct de l'erreur**

Si vous avez l'erreur 404, utilisez le lien fourni dans l'erreur :
```
https://console.cloud.google.com/datastore/setup?project=smartagricongpo
```

Ou créez directement via :
1. Allez sur [Google Cloud Console - Firestore](https://console.cloud.google.com/firestore/databases)
2. Sélectionnez votre projet `smartagricongpo`
3. Cliquez sur **"Créer une base de données"** ou **"Create database"**
4. Choisissez **"Firestore en mode natif"** (Native mode)
5. Sélectionnez une région
6. Cliquez sur **"Créer"**

**⚠️ IMPORTANT - Activer l'API Cloud Firestore :**

Si vous obtenez une erreur 403 "SERVICE_DISABLED", vous devez activer l'API Cloud Firestore :

1. Allez directement sur le lien fourni dans l'erreur, ou :
   - Allez sur [Google Cloud Console - APIs & Services](https://console.cloud.google.com/apis/library)
   - Sélectionnez votre projet Firebase (ex: `smartagricongpo`)
   - Recherchez "Cloud Firestore API"
   - Cliquez sur "Activer" ou "Enable"
   
   **OU** utilisez le lien direct (remplacez `smartagricongpo` par votre ID de projet) :
   ```
   https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=smartagricongpo
   ```

2. Attendez quelques minutes après l'activation pour que les changements se propagent

3. Vérifiez que l'API est bien activée dans la liste des APIs activées

### 3. Créer une clé de service (Service Account Key)

1. Dans Firebase Console, allez dans "Paramètres du projet" (icône d'engrenage) > "Paramètres du projet"
2. Allez dans l'onglet "Comptes de service" ou "Service accounts"
3. Cliquez sur "Générer une nouvelle clé privée" ou "Generate new private key"
4. Téléchargez le fichier JSON (ex: `serviceAccountKey.json`)
5. Placez ce fichier à la racine du projet (`/home/gemq/virtual/smartagricongo/`)

### 4. Configuration des règles Firestore (Sécurité)

Dans Firebase Console > Firestore Database > Règles, ajoutez ces règles pour le développement:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour la collection users
    match /users/{userId} {
      // Permettre la lecture/écriture pour le développement
      // ATTENTION: À modifier pour la production avec authentification appropriée
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANT:** Ces règles permettent l'accès complet. Pour la production, vous devez implémenter des règles de sécurité appropriées basées sur l'authentification.

### 5. Installer les dépendances Python

```bash
pip install -r requirements.txt
```

### 6. Configuration de l'application

Le fichier `firebase_config.py` cherche automatiquement le fichier `serviceAccountKey.json` à la racine du projet.

Si vous préférez utiliser une variable d'environnement, créez un fichier `.env`:

```bash
FIREBASE_SERVICE_ACCOUNT_KEY=serviceAccountKey.json
```

Ou vous pouvez mettre les credentials directement dans une variable d'environnement `FIREBASE_CREDENTIALS_JSON`.

### 7. Lancer l'application

```bash
python app.py
```

L'application devrait démarrer sur `http://localhost:5000`

## Structure Firestore

Le projet utilise la collection suivante:

### Collection: `users`

Chaque document contient:
- `fullname` (string): Nom complet de l'utilisateur
- `email` (string): Email de l'utilisateur (unique)
- `phone` (string): Numéro de téléphone
- `password` (string): Mot de passe hashé (Werkzeug)
- `photo` (string): Nom du fichier photo
- `created_at` (timestamp): Date de création du compte

## Dépannage

### Erreur: "Aucune configuration Firebase trouvée"

- Vérifiez que le fichier `serviceAccountKey.json` existe à la racine du projet
- Vérifiez que le fichier contient des credentials valides
- Vérifiez les permissions du fichier

### Erreur: "Permission denied"

- Vérifiez les règles Firestore dans la console Firebase
- Assurez-vous que Firestore est activé pour votre projet

### Erreur: 403 "SERVICE_DISABLED" - "Cloud Firestore API has not been used"

Cette erreur signifie que l'API Cloud Firestore n'est pas activée pour votre projet Google Cloud.

**Solution :**
1. Allez sur [Google Cloud Console - APIs & Services](https://console.cloud.google.com/apis/library)
2. Assurez-vous que votre projet Firebase est sélectionné (en haut de la page)
3. Recherchez "Cloud Firestore API" dans la barre de recherche
4. Cliquez sur "Cloud Firestore API" dans les résultats
5. Cliquez sur le bouton "ACTIVER" ou "ENABLE"
6. Attendez 2-3 minutes pour que l'activation se propage
7. Réessayez votre application

**Lien direct** (remplacez `VOTRE_PROJECT_ID` par l'ID de votre projet) :
```
https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=VOTRE_PROJECT_ID
```

### Erreur: 404 "The database (default) does not exist"

Cette erreur signifie que la base de données Firestore n'a pas encore été créée pour votre projet.

**Solution :**

1. **Via Firebase Console (Recommandé) :**
   - Allez sur [Firebase Console](https://console.firebase.google.com/)
   - Sélectionnez votre projet
   - Cliquez sur "Firestore Database" dans le menu de gauche
   - Cliquez sur "Créer une base de données"
   - Choisissez le mode "Test" pour le développement
   - Sélectionnez une région
   - Cliquez sur "Activer"

2. **Via Google Cloud Console :**
   - Utilisez le lien fourni dans l'erreur :
     ```
     https://console.cloud.google.com/datastore/setup?project=smartagricongpo
     ```
   - Ou allez sur [Google Cloud Console - Firestore](https://console.cloud.google.com/firestore/databases)
   - Sélectionnez votre projet
   - Cliquez sur "Créer une base de données"
   - Choisissez "Firestore en mode natif" (Native mode)
   - Sélectionnez une région
   - Cliquez sur "Créer"

3. **Vérification :**
   - Après la création, attendez quelques secondes
   - Vérifiez dans Firebase Console que la base de données apparaît
   - Relancez votre application Flask

**Note :** Assurez-vous d'avoir activé l'API Cloud Firestore (voir l'erreur précédente) avant de créer la base de données.

### Erreur: "Module not found: firebase_admin"

```bash
pip install firebase-admin
```

## Ressources

- [Documentation Firebase Admin SDK Python](https://firebase.google.com/docs/admin/setup)
- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

