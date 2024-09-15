from flask import Flask
from flask_cors import CORS
from database.models import db
from report.reports import reports_bp
from auth.auth import auth_bp
from sensor.sensor import sensor_bp 
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import DevelopmentConfig
from dotenv import load_dotenv

load_dotenv()


def create_app(config_class):
    app = Flask(__name__)
    app.config.from_object(config_class)
    jwt = JWTManager(app)
    CORS(app)
    mail = Mail(app)
    app.register_blueprint(reports_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(sensor_bp)
    db.init_app(app)
    return app


server = create_app(DevelopmentConfig)

if __name__ == "__main__":
    with server.app_context():
        db.create_all()
    server.run(debug=True, host='0.0.0.0')
