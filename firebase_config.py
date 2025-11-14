"""
Configuration Firebase pour SmartAgriCongo
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

# Initialiser Firebase Admin SDK
def init_firebase():
    """Initialise Firebase Admin SDK avec les credentials"""
    if not firebase_admin._apps:
        # Option 1: Utiliser un fichier de clé de service (recommandé pour production)
        service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY', 'serviceAccountKey.json')
        
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
        else:
            # Option 2: Utiliser les variables d'environnement (pour développement)
            # Vous pouvez aussi utiliser les credentials directement depuis les variables d'environnement
            try:
                # Si vous avez les credentials en JSON dans une variable d'environnement
                import json
                cred_json = os.getenv('FIREBASE_CREDENTIALS_JSON')
                if cred_json:
                    cred_dict = json.loads(cred_json)
                    cred = credentials.Certificate(cred_dict)
                    firebase_admin.initialize_app(cred)
                else:
                    raise ValueError("Aucune configuration Firebase trouvée. Veuillez configurer FIREBASE_SERVICE_ACCOUNT_KEY ou FIREBASE_CREDENTIALS_JSON")
            except Exception as e:
                raise ValueError(f"Erreur lors de l'initialisation Firebase: {str(e)}")
    
    return firestore.client()

# Obtenir l'instance Firestore
def get_db():
    """Retourne l'instance Firestore"""
    init_firebase()
    return firestore.client()

