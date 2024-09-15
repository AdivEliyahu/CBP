import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = 'Users'
    email = db.Column(db.String(100), primary_key=True)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(10), nullable=False)
    resetToken = db.Column(db.String(32), nullable=True)
    resetTokenExpiry = db.Column(db.DATETIME, nullable=True)
    token = db.Column(db.Text, nullable=True)


class Citizen(db.Model):
    __tablename__ = 'Citizen'
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phoneNum = db.Column(db.String(20), unique=True, nullable=False)
    address = db.Column(db.String(200), nullable=True)
    password = db.Column(db.String(100), nullable=False)


class Technician(db.Model):
    __tablename__ = 'Technician'
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    phoneNum = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)


class Dispatcher(db.Model):
    __tablename__ = 'Dispatcher'
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    phoneNum = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)



class Report(db.Model):
    __tablename__ = 'Reports'
    reportId = db.Column(db.String(100), primary_key=True)
    reporter = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    data = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(100), nullable=True)
    reportedAt = db.Column(db.DateTime(), default=datetime.datetime.now())
    isFixed = db.Column(db.Boolean, default=False)
    lastUpdate = db.Column(db.DateTime(), nullable=True)
    tech = db.Column(db.Integer, db.ForeignKey(Technician.id), nullable=True)
    techData = db.Column(db.String(100), nullable=True)
    techImage = db.Column(db.String(100), nullable=True)
    disp = db.Column(db.Integer, db.ForeignKey(Dispatcher.id), nullable=True)
    dispData = db.Column(db.String(100), nullable=True)



class SensorData(db.Model):
    __tablename__ = 'SensorData'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    temperature = db.Column(db.Float, nullable=False)
    vibration_sd = db.Column(db.Float, nullable=False)
    tilt = db.Column(db.Float, nullable=False)
    sample_time_utc = db.Column(db.DateTime, nullable=False)
    gw_read_time_utc = db.Column(db.DateTime, nullable=False)
    mac = db.Column(db.String(30), nullable=False)
    device_name = db.Column(db.String(30), nullable=False)
    location_lat = db.Column(db.Float, nullable=False)
    location_lng = db.Column(db.Float, nullable=False)
    unit_name = db.Column(db.String(30), nullable=False)

class Sensor(db.Model):
    __tablename__ = 'Sensor'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sensorId = db.Column(db.String(100), unique=True)
    lat = db.Column(db.String(100), nullable=False)
    lng = db.Column(db.String(100), nullable=False)
    installation_date = db.Column(db.DateTime(), default=datetime.datetime.now())

class SensorReport(db.Model):
    __tablename__ = 'sensorReports'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vibration = db.Column(db.Float, nullable=False)
    tilt = db.Column(db.Float, nullable=False)
    unit_location = db.Column(db.String(30), nullable=False)