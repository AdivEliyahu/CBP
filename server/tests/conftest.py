from datetime import datetime
import sys
import os
import time

sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/../'))

from server.database.models import Users, Citizen, Report, Dispatcher, Technician, SensorData
import pytest
from server.config import TestingConfig
from server.server import create_app
from flask_jwt_extended import create_access_token
import bcrypt




@pytest.fixture(scope='session')
def app():
    app = create_app(TestingConfig)
    with app.app_context():
        yield app


@pytest.fixture(scope='session', name='client')
def test_client(app):
    """Create a test client for the Flask application."""
    return app.test_client()


@pytest.fixture(scope='session', name='_db')
def init_db(app):
    from database.models import db
    """Initialize the test database."""
    with app.app_context():
        print("Creating database tables...", db)
        db.create_all()

        yield db
        print("Dropping database tables...")
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope='module', name='users')
def insert_users(_db):
    password = bcrypt.hashpw('Test1234'.encode('utf-8'), bcrypt.gensalt(15)).decode('utf-8')
    cit = Users(email='cit@example.com', password=password, role='citizen')
    cit.token = create_access_token(identity='cit@example.com')
    dis = Users(email='dis@example.com', password=password, role='Dispatcher')
    dis.token = create_access_token(identity='dis@example.com')
    tech = Users(email='tech@example.com', password=password, role='Technician')
    tech.token = create_access_token(identity='tech@example.com')
    _db.session.add(cit)
    _db.session.add(dis)
    _db.session.add(tech)
    _db.session.commit()
    yield cit, dis, tech

    _db.session.delete(cit)
    _db.session.delete(dis)
    _db.session.delete(tech)
    _db.session.commit()


@pytest.fixture(scope='module', name='hashed')
def get_hashed():
    def _get_hashed(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(15)).decode('utf-8')

    return _get_hashed


@pytest.fixture(scope='module', name='token')
def get_token():
    def _get_token(email):
        return create_access_token(identity=email)

    return _get_token


@pytest.fixture(scope='module', name='citizen')
def insert_citizen(_db):
    password = bcrypt.hashpw('Test1234'.encode('utf-8'), bcrypt.gensalt(15)).decode('utf-8')
    user = Citizen(id='123456789',
                   firstName='Cit',
                   lastName='Zen',
                   email='cit@example.com',
                   phoneNum='0501234567',
                   address='Test Addr',
                   password=password)
    _db.session.add(user)
    _db.session.commit()
    yield user

    _db.session.delete(user)
    _db.session.commit()


@pytest.fixture(scope='module', name='technician')
def insert_technician(_db):
    user = Technician(email='tech@example.com',
                      password='Test1234',
                      firstName='Tech',
                      lastName='Nician',
                      id='123456788',
                      phoneNum='0501234566')
    _db.session.add(user)
    _db.session.commit()
    yield user

    _db.session.delete(user)
    _db.session.commit()


@pytest.fixture(scope='module', name='dispatcher')
def insert_dispatcher(_db):
    user = Dispatcher(email='dis@example.com',
                      password='Test1234',
                      firstName='Dis',
                      lastName='Patcher',
                      id='123456777',
                      phoneNum='0501234567')
    _db.session.add(user)
    _db.session.commit()
    yield user
    
    reports = Report.__table__.delete().where(Report.disp == '123456777')
    _db.session.execute(reports)
    
    _db.session.delete(user)
    _db.session.commit()


@pytest.fixture(scope='module', name='report')
def insert_report(_db, technician, dispatcher):
    report = Report(
        reportId='1',
        reporter='123456789',
        location='report loc',
        data='test data',
        isFixed=True
        )
    _db.session.add(report)
    _db.session.commit()
    yield report

    _db.session.delete(report)
    _db.session.commit()
    

@pytest.fixture(scope='module', name='sensorData')
def insert_sensor_data(_db):
    sen = SensorData(
        temperature=25.6,
        vibration_sd=0.02,
        tilt=1.5,
        sample_time_utc=datetime.utcnow(),
        gw_read_time_utc=datetime.utcnow(),
        mac='00:1A:2B:3C:4D:5E',
        device_name='Sensor001',
        location_lat=40.7128,
        location_lng=-74.0060,
        unit_name='UnitA'
    )
    _db.session.add(sen)
    _db.session.commit()
    yield sen


# @pytest.fixture(scope='module', name='token_email')
# def insert_token_email(_db, admin):
#     token = Token(user_id=admin.id, type=TokenTypeEnum.VerifyEmail)
#     _db.session.add(token)
#     _db.session.commit()
#     yield token
#     _db.session.delete(token)
#     _db.session.commit()


# @pytest.fixture(scope='module', name='token_password')
# def insert_token_password(_db, admin):
#     token = Token(user_id=admin.id, type=TokenTypeEnum.ResetPassword)
#     _db.session.add(token)
#     _db.session.commit()
#     yield token
#     _db.session.delete(token)
#     _db.session.commit()


# @pytest.fixture(scope='module', name='notification')
# def insert_notification(_db, admin, lecturer):
#     notification = Notification(title='Test',
#                                 msg='Test',
#                                 type=NotificationType.VerifyUser,
#                                 belongToId=lecturer.id,
#                                 users=[admin])
#     _db.session.add(notification)
#     _db.session.commit()
#     yield notification
#     _db.session.delete(notification)
#     _db.session.commit()


# @pytest.fixture(scope='module', name='auth_admin')
# def autherized_admin(client, admin, _db):
#     data = {
#         "email": admin.email,
#         "password": admin.password
#     }
#     admin.hashPassword()
#     admin.verifiedEmail = True
#     admin.active = True
#     _db.session.commit()
#     with client:
#         response = client.post('/api/auth/login', json=data)
#         assert response.status_code == 200
#         return response.get_json()
#
#
# @pytest.fixture(scope='module', name='auth_student')
# def autherized_student(client, student, _db):
#     data = {
#         "email": student.email,
#         "password": student.password
#     }
#     student.hashPassword()
#     student.verifiedEmail = True
#     student.active = True
#     _db.session.commit()
#     with client:
#         response = client.post('/api/auth/login', json=data)
#         assert response.status_code == 200
#         return response.get_json()
#
#
# @pytest.fixture(scope='module', name='auth_lecturer')
# def autherized_lecturer(client, lecturer, _db):
#     data = {
#         "email": lecturer.email,
#         "password": lecturer.password
#     }
#     lecturer.hashPassword()
#     lecturer.verifiedEmail = True
#     lecturer.active = True
#     _db.session.commit()
#     with client:
#         response = client.post('/api/auth/login', json=data)
#         assert response.status_code == 200
#         return response.get_json()
