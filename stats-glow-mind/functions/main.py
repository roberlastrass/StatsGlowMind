import json
import pickle
import pandas as pd
import io
import firebase_admin
from firebase_admin import credentials, storage
from firebase_functions import https_fn
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

# Inicializa la aplicación Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Inicializa la aplicación Firebase
cred = credentials.Certificate('credentials/statsglowmindtfg-firebase-adminsdk-p48do-38d14e179c.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'statsglowmindtfg.appspot.com'
})

# Función para obtener estadísticas promedio de la temporada basadas en el equipo_id
def get_team_avg_stats(team_id, avg_stats):
    team_stats = avg_stats[avg_stats['team_id'] == team_id].to_dict('records')[0]
    return team_stats

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict_route():
    if request.method == 'OPTIONS':
        response = make_response('', 204)
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    if request.method != 'POST':
        response = make_response('Método no permitido', 405)
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    
    try:
        # Descargar el archivo CSV con las estadísticas promedio de la temporada
        bucket = storage.bucket()
        blob_avg = bucket.blob('team_avg_stats.csv')
        csv_avg_data = blob_avg.download_as_string()
        avg_stats = pd.read_csv(io.BytesIO(csv_avg_data))

        # Descargar el modelo desde Firebase Storage
        model_blob = bucket.blob('random_forest_model.pkl')
        model_data = model_blob.download_as_string()

        # Cargar el modelo desde el archivo descargado
        model = pickle.loads(model_data)

        # Extraer las IDs de los equipos de la solicitud
        request_data = request.get_json()
        home_team_id = request_data.get('home_team_id')
        visitor_team_id = request_data.get('visitor_team_id')

        if home_team_id is None or visitor_team_id is None:
            response = make_response('IDs de equipos faltantes en la solicitud', 400)
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response

        # Obtener las estadísticas promedio de la temporada de los equipos
        home_stats = get_team_avg_stats(home_team_id, avg_stats)
        visitor_stats = get_team_avg_stats(visitor_team_id, avg_stats)

        # Crear DataFrame de entrada para predicción
        input_data = {
            'home_assists': [home_stats['team_assists']],
            'home_blocks': [home_stats['team_blocks']],
            'home_defReb': [home_stats['team_defReb']],
            'home_fga': [home_stats['team_fga']],
            'home_fgm': [home_stats['team_fgm']],
            'home_fgp': [home_stats['team_fgp']],
            'home_fta': [home_stats['team_fta']],
            'home_ftm': [home_stats['team_ftm']],
            'home_ftp': [home_stats['team_ftp']],
            'home_offReb': [home_stats['team_offReb']],
            'home_pFouls': [home_stats['team_pFouls']],
            'home_plusMinus': [home_stats['team_plusMinus']],
            'home_points': [home_stats['team_points']],
            'home_steals': [home_stats['team_steals']],
            'home_totReb': [home_stats['team_totReb']],
            'home_tpa': [home_stats['team_tpa']],
            'home_tpm': [home_stats['team_tpm']],
            'home_tpp': [home_stats['team_tpp']],
            'home_turnovers': [home_stats['team_turnovers']],
            'visitor_assists': [visitor_stats['team_assists']],
            'visitor_blocks': [visitor_stats['team_blocks']],
            'visitor_defReb': [visitor_stats['team_defReb']],
            'visitor_fga': [visitor_stats['team_fga']],
            'visitor_fgm': [visitor_stats['team_fgm']],
            'visitor_fgp': [visitor_stats['team_fgp']],
            'visitor_fta': [visitor_stats['team_fta']],
            'visitor_ftm': [visitor_stats['team_ftm']],
            'visitor_ftp': [visitor_stats['team_ftp']],
            'visitor_offReb': [visitor_stats['team_offReb']],
            'visitor_pFouls': [visitor_stats['team_pFouls']],
            'visitor_plusMinus': [visitor_stats['team_plusMinus']],
            'visitor_points': [visitor_stats['team_points']],
            'visitor_steals': [visitor_stats['team_steals']],
            'visitor_totReb': [visitor_stats['team_totReb']],
            'visitor_tpa': [visitor_stats['team_tpa']],
            'visitor_tpm': [visitor_stats['team_tpm']],
            'visitor_tpp': [visitor_stats['team_tpp']],
            'visitor_turnovers': [visitor_stats['team_turnovers']]
        }

        user_input = pd.DataFrame(input_data)

        # Realizar la predicción
        probabilities = model.predict_proba(user_input)
        prediction = model.predict(user_input)

        # Probabilidad de que gane el equipo local
        prob_home_win = probabilities[0][1]
        # Probabilidad de que gane el equipo visitante
        prob_visitor_win = probabilities[0][0]

        # Enviar la respuesta con las probabilidades
        response = jsonify({
            'prob_home_win': prob_home_win,
            'prob_visitor_win': prob_visitor_win
        })
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response, 200
    
    except Exception as e:
        # Print detailed error for debugging
        print(f'Error en la predicción: {str(e)}')
        response = make_response(f'Error en la predicción: {str(e)}', 500)
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

# Si estás usando Firebase Functions, necesitas un wrapper para la función Flask
@https_fn.on_request()
def predict(request):
    with app.app_context():
        return predict_route()
