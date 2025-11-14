from flask import Flask, jsonify, render_template, request, redirect, url_for, session, flash
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import timedelta
from firebase_config import get_db

app = Flask(__name__, template_folder=os.path.abspath('templates'))

# Configuration
app.secret_key = os.urandom(24)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']
import requests
from datetime import datetime
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Config API Météo
WEATHER_API_KEY = "a94cb8abe894dca7af151e236c09647d"  #ma clé API OpenWeatherMap
WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"

# Config API OpenAI
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

@app.route('/get_weather')
def get_weather():
    if 'user' not in session:
        return jsonify({"error": "Non autorisé"}), 401
    
    # Récupérer la localisation (à adapter)
    lat = request.args.get('lat', -4.3)  # Par défaut Brazzaville
    lon = request.args.get('lon', 15.3)
    
    try:
        params = {
            'lat': lat,
            'lon': lon,
            'appid': WEATHER_API_KEY,
            'units': 'metric',  # Celsius
            'lang': 'fr'
        }
        
        response = requests.get(WEATHER_API_URL, params=params)
        data = response.json()
        
        # Formater les données
        weather_data = {
            'temp': data['main']['temp'],
            'description': data['weather'][0]['description'],
            'icon': f"https://openweathermap.org/img/wn/{data['weather'][0]['icon']}@2x.png",
            'humidity': data['main']['humidity'],
            'wind': data['wind']['speed'],
            'feels_like': data['main'].get('feels_like', data['main']['temp']),
            'pressure': data['main'].get('pressure', 1013),
            'temp_min': data['main'].get('temp_min'),
            'temp_max': data['main'].get('temp_max'),
            'updated': datetime.now().strftime("%H:%M")
        }
        
        return jsonify(weather_data)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500





# Routes principales
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET'])
def login_page():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/register', methods=['GET'])
def register_page():
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return render_template('register.html')

# Authentification
@app.route('/login', methods=['POST'])
def login():
    try:
        email = request.form['email']
        password = request.form['password']
        
        db = get_db()
        # Rechercher l'utilisateur par email dans Firestore
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).limit(1)
        docs = query.stream()
        
        user = None
        user_id = None
        for doc in docs:
            user = doc.to_dict()
            user_id = doc.id
            break

        if user and check_password_hash(user.get('password', ''), password):
            session['user'] = {
                'id': user_id,
                'fullname': user.get('fullname', ''),
                'email': user.get('email', ''),
                'photo': user.get('photo', 'default-profile.png')  # Le nom du fichier photo
            }
            return redirect(url_for('dashboard'))
        
        flash('Email ou mot de passe incorrect', 'error')
        return redirect(url_for('login_page'))

    except Exception as e:
        flash(f"Erreur de connexion: {str(e)}", 'error')
        return redirect(url_for('login_page'))

@app.route('/register', methods=['POST'])
def register():
    try:
        # Récupération des données
        fullname = request.form['fullname']
        email = request.form['email']
        phone = request.form['phone']
        password = generate_password_hash(request.form['password'])
        
        db = get_db()
        
        # Vérifier si l'email existe déjà
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).limit(1)
        existing_users = list(query.stream())
        
        if existing_users:
            flash('Cet email est déjà utilisé', 'error')
            return redirect(url_for('register_page'))
        
        # Gestion de la photo
        if 'use_default' in request.form:
            filename = 'default-profile.png'
        else:
            photo = request.files['photo']
            if photo and allowed_file(photo.filename):
                filename = secure_filename(f"{email}_{photo.filename}")
                photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            else:
                flash('Format de fichier non valide', 'error')
                return redirect(url_for('register_page'))

        # Insertion dans Firestore
        user_data = {
            'fullname': fullname,
            'email': email,
            'phone': phone,
            'password': password,
            'photo': filename,
            'created_at': datetime.now()
        }
        
        db.collection('users').add(user_data)
        
        flash('Inscription réussie!', 'success')
        return redirect(url_for('login_page'))

    except Exception as e:
        flash(f"Erreur: {str(e)}", 'error')
        return redirect(url_for('register_page'))
# Tableau de bord
@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login_page'))
    return render_template('dashboard.html', user=session['user'])

# Marketplace
@app.route('/marketplace')
def marketplace():
    if 'user' not in session:
        return redirect(url_for('login_page'))
    return render_template('marketplace.html', user=session['user'])

# Cultures
@app.route('/cultures')
def cultures():
    if 'user' not in session:
        return redirect(url_for('login_page'))
    return render_template('cultures.html', user=session['user'])

# Météo
@app.route('/meteo')
def meteo():
    if 'user' not in session:
        return redirect(url_for('login_page'))
    return render_template('meteo.html', user=session['user'])

# Carte agricole
@app.route('/carte-agricole')
def carte_agricole():
    if 'user' not in session:
        return redirect(url_for('login_page'))
    return render_template('carte_agricole.html', user=session['user'])

# Déconnexion
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))  # Redirige vers la page d'accueil

# Chatbot OpenAI
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    if 'user' not in session:
        return jsonify({"error": "Non autorisé"}), 401
    
    if not openai_client:
        return jsonify({"error": "OpenAI API non configurée. Veuillez définir OPENAI_API_KEY dans votre fichier .env"}), 500
    
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "Message vide"}), 400
        
        # Contexte pour le chatbot agricole
        system_prompt = """Tu es un assistant agricole expert pour SmartAgriCongo, une plateforme d'agriculture intelligente au Congo. 
        Tu aides les agriculteurs avec des conseils sur les cultures (manioc, banane, maïs, haricot), les techniques agricoles, 
        la gestion des cultures, et les meilleures pratiques. Réponds en français de manière claire, concise et professionnelle.
        Si on te pose des questions hors sujet, redirige poliment vers les sujets agricoles."""
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        bot_response = response.choices[0].message.content
        
        return jsonify({
            "response": bot_response,
            "success": True
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Gestion des erreurs
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    # Créer le dossier uploads s'il n'existe pas
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    # Pour la production, utiliser le PORT de l'environnement
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)