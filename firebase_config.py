"""
Configuration Firebase pour SmartAgriCongo - Version Render
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore
import json

# Initialiser Firebase Admin SDK
def init_firebase():
    """Initialise Firebase Admin SDK avec les credentials pour Render"""
    if not firebase_admin._apps:
        try:
            # METHODE RENDER: Utiliser FIREBASE_CREDENTIALS_JSON
            cred_json = os.getenv('FIREBASE_CREDENTIALS_JSON')
            
            if cred_json:
                # Convertir le JSON string en dictionnaire
                cred_dict = json.loads(cred_json)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                print("✅ Firebase initialisé avec FIREBASE_CREDENTIALS_JSON")
                
            else:
                # Fallback: Application Default Credentials
                firebase_admin.initialize_app()
                print("✅ Firebase initialisé avec ADC")
                
        except json.JSONDecodeError as e:
            raise ValueError(f"Erreur de décodage JSON: {str(e)}")
        except Exception as e:
            raise ValueError(f"Erreur lors de l'initialisation Firebase: {str(e)}")
    
    return firestore.client()

# Obtenir l'instance Firestore
def get_db():
    """Retourne l'instance Firestore"""
    init_firebase()
    return firestore.client()