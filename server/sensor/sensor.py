from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required



sensor_bp = Blueprint('sensor', __name__, url_prefix='/sensor')



@sensor_bp.post('/loginToken')
def AutomationToken(): 
    import requests , os, json
    from datetime import datetime
    login_url = "https://atapi.atomation.net/api/v1/s2s/v1_0/auth/login"
    login_payload = {
        "email": "sce@atomation.net",
        "password": "123456"
    }

    headers = {
        "app_version": "1.4.5.dev.4",
        "access_type": "5"
    }

    response = requests.post(login_url, data=login_payload, headers=headers)
    

    if response.status_code == 200:
        response_data = response.json()
        token = response_data.get("data", {}).get("token")
        refreshToken = response_data.get("data", {}).get("refresh_token")
        
        if response_data:

            time_string = datetime.now()
            temp = {
                'token': token,
                'refresh_Token': refreshToken,
                'time': str(time_string)
            }
            try:
                with open('AutomationToken.json', 'w') as file:
                    json.dump(temp, file)
                print("\nToken successfully written to AutomationToken.json")
            except Exception as e:
                print(f"\nFailed to write token to AutomationToken.json: {e}")
    else:
        print("\nFailed to retrieve token.")

  
    


@sensor_bp.get('/refreshToken')
def getRefreshToken():
    import requests ,json
    from datetime import datetime, timedelta

    now = datetime.now()
    token_time = getTokenTime()
    time_delta_tokens = now - token_time
    one_hours = timedelta(hours=1)

    if time_delta_tokens > one_hours:
        curr_token = getTokenDetails()['token']
        ref_token = getTokenDetails()['refresh_Token']

        token_url = "https://atapi.atomation.net/api/v1/s2s/v1_0/auth/token"
        headers = {
            "app_version": "1.4.5.dev.4",
            "access_type": "5"
        }
        request_body = {
            "current_token": curr_token, 
            "refresh_token": ref_token,
            "grant_type": "refresh_token"
        }
        response = requests.post(token_url, json=request_body, headers=headers)
        response_data = response.json()
        token = response_data.get("data", {}).get("token")
        refreshToken = response_data.get("data", {}).get("refresh_token")

        if response.status_code == 200:
            now = datetime.now()
            token_data = {'token': token, 'refresh_Token': refreshToken, 'time': str(now)}
            with open('AutomationToken.json', 'w') as token_file:
                json.dump(token_data, token_file)
            print("Refreshed token reloaded.")
        else:
            print("Failed to fetch token:", response.text)

@sensor_bp.get('/fetch')
def fetch_data(): 
    import requests
    from database.models import SensorData, db
    from datetime import datetime

    now = datetime.utcnow()
    end_date = now.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    start_date = (now - timedelta(days=2)).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    request_body = {
        "filters": {
            "start_date": start_date,
            "end_date": end_date,

            "mac": ["CB:85:C7:AB:66:81"],
            "createdAt": True
        },
        "limit": {
            "page": 1,
            "page_size": 100
        }
    }

    data_url = "https://atapi.atomation.net/api/v1/s2s/v1_0/sensors_readings"

    getRefreshToken()
    
    token = getTokenDetails()['token']
    headers = {
        "Authorization": f"Bearer {token}",
        "app_version": "1.4.5.dev.4",
        "access_type": "5"
    }
    
    response = requests.post(data_url, json=request_body, headers=headers)
    
    if response.status_code == 200:
        response_data = response.json()
        readings_data = response_data.get("data", {}).get("readings_data", [])

        session = db.session
        
        for reading in readings_data:
            sample_time_utc = datetime.strptime(reading['sample_time_utc'], "%Y-%m-%dT%H:%M:%S.%fZ")
            gw_read_time_utc = datetime.strptime(reading['gw_read_time_utc'], "%Y-%m-%dT%H:%M:%S.%fZ")


            if reading['Vibration SD'] > 0.006 or abs(reading['Tilt'] - 90) > 0.2 or reading['Temperature'] > 50.0: 

                sensor_data = SensorData(
                    temperature=reading['Temperature'],
                    vibration_sd=reading['Vibration SD'],
                    tilt=reading['Tilt'],
                    sample_time_utc=sample_time_utc,
                    gw_read_time_utc=gw_read_time_utc,
                    mac=reading['mac'],
                    device_name=reading['device_name'],
                    location_lat=reading['location']['lat'],
                    location_lng=reading['location']['lng'],
                    unit_name=reading['unit_name']
                )
                
                session.add(sensor_data)
        
        try:
            session.commit()
        except:
            session.rollback()
            print("Data might already exist.")
        
        return {"msg": "Data added to database successfully."}
    
    else: 
        print("Could not retrieve data.")
        return {"msg": "Could not retrieve new data."}




def getTokenTime():
    import json
    from datetime import datetime

    with open('AutomationToken.json', 'r') as token_file:
        token_data = json.load(token_file)
        time_format = "%Y-%m-%d %H:%M:%S.%f"       
        dt = datetime.strptime(token_data['time'], time_format)
        
        return dt
    
    
def getTokenDetails(): 
    import json
    with open('AutomationToken.json', 'r') as token_file:
        token_data = json.load(token_file)
        return token_data


@sensor_bp.get('/getData')
def get_data():
    from database.models import SensorData, db
    try:
        sensor_data = SensorData.query.all()
        
        data = [
            {
                'id': item.id,
                'temperature': item.temperature,
                'vibration_sd': item.vibration_sd,
                'tilt': item.tilt,
                'sample_time_utc': item.sample_time_utc.isoformat(),
                'gw_read_time_utc': item.gw_read_time_utc.isoformat(),
                'mac': item.mac,
                'device_name': item.device_name,
                'location_lat': item.location_lat,
                'location_lng': item.location_lng,
                'unit_name': item.unit_name,
            } for item in sensor_data
        ]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sensor_bp.post('/newsensor')
def add_new_sensor():
    from database.models import Sensor, db
    from datetime import datetime
    try:
        data = request.get_json()
        if not data:
            return jsonify({'data': 'No Data Found'}), 404
        else:
            sensor = Sensor(sensorId = data.get('id'),
                            lat=data.get('lat'),
                            lng=data.get('lng'),
                            installation_date=datetime.now()
                            )
                   
            db.session.add(sensor)
            db.session.commit()
            return jsonify({"data": "Added sensor successfully"}), 200
    except Exception as e:
        return jsonify({'data': 'Server Error', 'error': str(e)}), 500
    
    
@sensor_bp.get('/viewsensors')
def get_all_sensors():
    from database.models import Sensor, db
    try:
        data = Sensor.query.all()
        if not data:
            return jsonify({'data': 'No Data Found'}), 404
        else:
            sensors = [
                {
                    'sensorId': item.sensorId,
                    'lat': item.lat,
                    'lng': item.lng,
                    'installation_date': item.installation_date
                } for item in data
            ]
            return jsonify(sensors), 200
    except Exception as e:
        return jsonify({'data': 'Server Error', 'error': str(e)}), 500

@sensor_bp.get('/sensor-reports')
def get_sensor_reports():
    try:
        from database.models import SensorReport
        sensor_reports = SensorReport.query.all()
        reports = [
            {
                "id": report.id,
                "vibration": report.vibration,
                "tilt": report.tilt,
                "unit_location": report.unit_location
            }
            for report in sensor_reports
        ]
        return jsonify(reports), 200
    except Exception as e:
        return jsonify({'data': 'Server Error', 'error': str(e)}), 500