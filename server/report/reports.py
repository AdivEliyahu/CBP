from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import extract, and_
import uuid

reports_bp = Blueprint('report', __name__, url_prefix='/report')


@reports_bp.get('/reporter/<id>')
@jwt_required()
def get_by_reporter_id(id):
    from database.models import Report
    try:
        reports = Report.query.filter_by(reporter=id).all()
        if not reports:
            return jsonify({'data': 'No Reports Found'}), 200
        else:
            return jsonify(
                [{'reportId': report.reportId,
                  'reporter': report.reporter,
                  'location': report.location,
                  'data': report.data,
                  'image': report.image,
                  'reportedAt': report.reportedAt,
                  'isFixed': report.isFixed,
                  'lastUpdate': report.lastUpdate,
                  'tech': report.tech,
                  'techData': report.techData,
                  'disp': report.disp,
                  'dispData': report.dispData} for report in reports]), 200
    except Exception as e:
        return jsonify({'data': 'Server Error', 'error': str(e)}), 500


@reports_bp.post('/new')
@jwt_required()
def create_new_report():
    from database.models import Report, db
    from datetime import datetime
    try:
        data = request.get_json()
        if not data:
            return jsonify({'data': 'No Data Found'}), 404
        else:
            report = Report(reportId=uuid.uuid4(),
                            reporter=data.get('id'),
                            location=data.get('location'),
                            image=data.get('image'),
                            data=data.get('data'),
                            reportedAt=datetime.now()
                            )
            db.session.add(report)
            db.session.commit()
            return jsonify({"data": "New report created"}), 200
    except Exception as e:
        return jsonify({'data': 'Server Error', 'error': str(e)}), 500
    


@reports_bp.post('/dispatcher/new')
@jwt_required()
def create_new_disp_report():
    from database.models import SensorData,Report, db
    from datetime import datetime
    try:
        data = request.get_json()
        if not data:
            return jsonify({'data': 'No Data Found'}), 404
        else:
            report = Report(reportId=uuid.uuid4(),
                            reporter=data.get('id'),
                            location=data.get('location'),
                            image=data.get('image'),
                            data=data.get('data'),
                            disp=data.get('id'),
                            reportedAt=datetime.now()
                            )
            db.session.add(report)
            sensor_to_delete = SensorData.query.get(data.get('sensorId'))
            db.session.delete(sensor_to_delete)
            db.session.commit()
            return jsonify({"data": "New report created"}), 200
    except Exception as e:
        return jsonify({'data': 'Server Error', 'error': str(e)}), 500


@reports_bp.get('/fixed/<year>')
@jwt_required()
def get_fixed_by_year(year):
    from database.models import Report
    try:
        reports = Report.query.filter(and_(extract('year', Report.reportedAt) == year,
                                           Report.isFixed == True
                                           )
                                      ).all()
        if not reports:
            return jsonify({'data': 'No Reports Found'}), 404
        else:
            return jsonify(
                [{'reportId': report.reportId,
                  'reporter': report.reporter,
                  'location': report.location,
                  'data': report.data,
                  'image': report.image,
                  'reportedAt': report.reportedAt,
                  'isFixed': report.isFixed,
                  'lastUpdate': report.lastUpdate,
                  'tech': report.tech,
                  'techData': report.techData,
                  'disp': report.disp,
                  'dispData': report.dispData} for report in reports]), 200
    except Exception as e:
        return jsonify({'data': 'Server Error', 'error': str(e)}), 500


@reports_bp.post('/edit/<id>')
@jwt_required()
def edit_report(id):
    from database.models import Report, db
    try:
        data = request.get_json()
        if not data:
            return jsonify({'data': 'No Data Found'}), 404
        else:
            report = Report.query.filter_by(reportId=id).first()
            if report:
                location = data.get('location')
                image = data.get('image')
                data = data.get('data')
                print(image)
                if image is not None:
                    report.image = image
                report.data = data
                report.location = location
                db.session.commit()
                return jsonify({"data": "Report edited."}), 200
            else:
                return jsonify({"data": "No report found."}), 400
    except Exception as e:
        return jsonify({'data': 'Server Error', 'error': str(e)}), 500


@reports_bp.get('/calls/<id>')
@jwt_required()
def get_calls_by_id(id):
    from database.models import Report
    try:
        reports = Report.query.filter_by(tech=id).all()
        if not reports:
            return jsonify({'data': 'No Calls Found'}), 200
        else:
            return jsonify(
                [{'reportId': report.reportId,
                  'reporter': report.reporter,
                  'location': report.location,
                  'data': report.data,
                  'image': report.image,
                  'reportedAt': report.reportedAt,
                  'isFixed': report.isFixed,
                  'lastUpdate': report.lastUpdate,
                  'tech': report.tech,
                  'techData': report.techData,
                  'disp': report.disp,
                  'dispData': report.dispData} for report in reports]), 200
    except Exception as e:
        return jsonify({'data': 'Server Error', 'error': str(e)}), 500