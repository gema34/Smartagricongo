from flask import Flask, jsonify, render_template, request, redirect, url_for, session, flash
import mysql.connector
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import timedelta

app = Flask(__name__, template_folder=os.path.abspath('templates'))

# Configuration
app.secret_key = os.urandom(24)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

# Configuration MySQL
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'smartagricongo'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']
import requests
from datetime import datetime

# Config API Météo
WEATHER_API_KEY = "a94cb8abe894dca7af151e236c09647d"  #ma clé API OpenWeatherMap
WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"

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
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user['password'], password):
            session['user'] = {
                'id': user['id'],
                'fullname': user['fullname'],
                'email': user['email'],
                'photo': user['photo']  # Le nom du fichier photo
            }
            return redirect(url_for('dashboard'))
        
        flash('Email ou mot de passe incorrect', 'error')
        return redirect(url_for('login_page'))

    except Exception as e:
        flash(f"Erreur de connexion: {str(e)}", 'error')
        return redirect(url_for('login_page'))

@app.route('/register', methods=['POST'])
@app.route('/register', methods=['POST'])
def register():
    try:
        # Récupération des données
        fullname = request.form['fullname']
        email = request.form['email']
        phone = request.form['phone']
        password = generate_password_hash(request.form['password'])
        
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

        # Insertion en base
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (fullname, email, phone, password, photo) VALUES (%s, %s, %s, %s, %s)",
            (fullname, email, phone, password, filename)
        )
        conn.commit()
        
        flash('Inscription réussie!', 'success')
        return redirect(url_for('login_page'))

    except Exception as e:
        if 'conn' in locals(): conn.rollback()
        flash(f"Erreur: {str(e)}", 'error')
        return redirect(url_for('register_page'))
    finally:
        if 'conn' in locals(): conn.close()
# Tableau de bord
@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login_page'))
    return render_template('dashboard.html', user=session['user'])

# Déconnexion
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))  # Redirige vers la page d'accueil

# Gestion des erreurs
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    # Créer le dossier uploads s'il n'existe pas
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)