import datetime
from flask import Blueprint, request, jsonify
import bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import secrets
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')



@auth_bp.post('/login')
def login():
    from database.models import Users, Citizen, Technician, Dispatcher, db
    data = request.get_json()
    password = data.get('password')
    email = data.get('email')

    if not password or not email:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        user = Users.query.filter_by(email=email).first()
        r_user = user
        userRole = user.role
        if user.role == "citizen":
            user = Citizen.query.filter_by(email=email).first()
        elif user.role == "technician":
            user = Technician.query.filter_by(email=email).first()
        elif user.role == "dispatcher":
            user = Dispatcher.query.filter_by(email=email).first()

        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            userToken = create_access_token(identity=email)
            r_user.token = userToken
            db.session.commit()

            return jsonify({"userToken": userToken, "user": {"id": user.id,
                                                             "role": userRole,
                                                             "firstName": user.firstName,
                                                             "lastName": user.lastName,
                                                             "email": user.email,
                                                             "phoneNum": user.phoneNum
                                                             }}), 200

        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.post('/register')
def register():
    from database.models import Citizen, Users, db
    data = request.get_json()

    email_exists = Citizen.query.filter_by(email=data.get('email')).first()
    phone_exists = Citizen.query.filter_by(phoneNum=data.get('phoneNumber')).first()
    id_exists = Citizen.query.filter_by(id=data.get('id')).first()

    if email_exists:
        return jsonify({"message": "Email already registered", "field": "email"}), 409,
    if phone_exists:
        return jsonify({"message": "Phone number already registered", "field": "phone"}), 409,
    if id_exists:
        return jsonify({"message": "ID already registered", "field": "id"}), 409,

    password = data.get('password')
    hashedPassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(15)).decode('utf-8')

    user_instance = Users(email=data.get('email'),
                          password=hashedPassword,
                          role="citizen")
    citizen_instance = Citizen(id=data.get('id'),
                               firstName=data.get('firstName'),
                               lastName=data.get('lastName'),
                               email=data.get('email'),
                               phoneNum=data.get('phoneNumber'),
                               address=data.get('address'),
                               password=hashedPassword)

    db.session.add(citizen_instance)
    db.session.add(user_instance)
    db.session.commit()
    return jsonify({"message": "Registration successful"}), 200


@auth_bp.get('/home')
@jwt_required()
def home():
    from database.models import Citizen,Technician,Dispatcher,Users
    current_user = get_jwt_identity()

    user = Users.query.filter_by(email=current_user).first()
    if user.role == "technician": 
        user = Technician.query.filter_by(email=current_user).first()
    elif user.role == "dispatcher":
        user = Dispatcher.query.filter_by(email=current_user).first()
    else:
        user = Citizen.query.filter_by(email=current_user).first()
    return jsonify(userName=user.firstName), 200


@auth_bp.get('/getUserData')
@jwt_required()
def getUserData():
    from database.models import Citizen, Technician, Dispatcher, Users

    current_user = get_jwt_identity()
    general_user = Users.query.filter_by(email=current_user).first()

    if general_user.role == "dispatcher": 
        user = Dispatcher.query.filter_by(email=current_user).first()
    elif general_user.role == "technician":
        user = Technician.query.filter_by(email=current_user).first()
    else:
        user = Citizen.query.filter_by(email=current_user).first()
  
    if general_user.role == "citizen":
        return jsonify(firstName=user.firstName,
                       lastName=user.lastName,
                       email=user.email,
                       phoneNumber=user.phoneNum,
                       address=user.address,
                       id=user.id,
                       role = general_user.role
                       ), 200
    elif general_user.role == "technician" or general_user.role == "dispatcher":
        return jsonify(firstName=user.firstName,
                       lastName=user.lastName,
                       email=user.email,
                       phoneNumber=user.phoneNum,
                       id=user.id,
                       role = general_user.role
                       ), 200
    else:
        return jsonify({"error": "Couldn't find user"}), 400
        


@auth_bp.post('/editProfile')
@jwt_required()
def editProfile():
    from database.models import Citizen,Dispatcher,Technician, Users, db
    import traceback
    current_user_email = get_jwt_identity()

    data = request.get_json()
    new_email = data.get('email')
    new_phoneNum = data.get('phoneNumber')
    new_password = data.get('newPassword')

    try:
        #citizen = Citizen.query.filter_by(email=current_user_email).first()#remove this //line 160
        general_user = Users.query.filter_by(email=current_user_email).first()

        if new_email != current_user_email :
            if Users.query.filter_by(email=new_email).first():
                return jsonify(message='Email is already in use'), 400

        # if new_phoneNum != citizen.phoneNum: #maybe we should drop the unique phone number 
        #     if Citizen.query.filter_by(phoneNum=new_phoneNum).first() or Technician.query.filter_by(phoneNum=new_phoneNum).first() or Dispatcher.query.filter_by(phoneNum=new_phoneNum).first():
        #         return jsonify(message='Phone number is already in use'), 400


        if general_user.role == "dispatcher": 
            user = Dispatcher.query.filter_by(email=general_user.email).first()
        elif general_user.role == "technician":
            user = Technician.query.filter_by(email=general_user.email).first()
        else:
            user = Citizen.query.filter_by(email=general_user.email).first()

        user.firstName = data.get('firstName')
        user.lastName = data.get('lastName')
        user.email = new_email
        general_user.email = new_email
        user.phoneNum = new_phoneNum
        if general_user.role == "citizen":
            user.address = data.get('address')
        if new_password != "":
            hashedPassword = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt(15))
            general_user.password = hashedPassword
            user.password = hashedPassword

   
        db.session.commit()
        userToken = create_access_token(identity=new_email)

        return jsonify(message="Profile updated successfully", token=userToken), 200

    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify(message=str(e)), 500


@auth_bp.post('/forgot-password')
def forgot_password():
    from database.models import Users, db
    from datetime import datetime, timedelta, timezone
    import os

    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required", "status": False}), 400

    user = Users.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "Email not found", "status": False}), 404

    try:

        token = secrets.token_urlsafe(8)
        user.resetToken = token
        user.resetTokenExpiry = datetime.now(timezone.utc) + timedelta(hours=1) + timedelta(hours=1)

        db.session.commit()

        reset_link = f"http://localhost:3000/resetPass/{token}"
        print(reset_link)

        # Create the email content
        message = Mail(
            from_email=os.environ.get('MAIL_DEFAULT_SENDER'),
            to_emails=email,
            subject='Password Reset Request',
            plain_text_content=f'Please click the following link to reset your password: {reset_link}'
        )

        # Send the email using SendGrid
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        sg.send(message)

        return jsonify({"message": "A password reset link has been sent to your email", "status": True}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": "Internal server error"}), 500


@auth_bp.post('/resetSub/<token>')
def reset_password(token):
    from database.models import Users, Citizen, Dispatcher, Technician, db
    data = request.get_json()
    user_new_pass = data.get('password')
    token = data.get('token')

    user = Users.query.filter_by(resetToken=token).first()

    if not user:
        return jsonify({"error": "Invalid or expired token"}), 400

    try:
        hashedPassword = bcrypt.hashpw(user_new_pass.encode('utf-8'), bcrypt.gensalt(15))

        user.password = hashedPassword
        user.resetToken = None
        user.resetTokenExpiry = None
        if user.role == "citizen":
            citizen = Citizen.query.filter_by(email=user.email).first()
            citizen.password = hashedPassword
        elif user.role == "dispatcher":
            dispatcher = Dispatcher.query.filter_by(email=user.email).first()
            dispatcher.password = hashedPassword
        elif user.role == "technician":
            technician = Technician.query.filter_by(email=user.email).first()
            technician.password = hashedPassword

        db.session.commit()

        return jsonify({"message": "Password reset successfully"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.post('/logout')
@jwt_required()
def logout():
    from database.models import Users, db
    current_user_email = get_jwt_identity()

    try:
        user = Users.query.filter_by(email=current_user_email).first()

        if not user:
            return jsonify(message='Something went wrong'), 500

        user.token = None
        db.session.commit()
        return jsonify(message="Logout successfully"), 200

    except Exception as e:
        db.session.rollback()
        return jsonify(message=str(e)), 500



@auth_bp.post('/workerRegister')
def workerRegister():
    from database.models import Dispatcher,Technician,Users,db
    data = request.get_json()
    user_role = data.get('role')

    if user_role == "dispatcher":
        email_exists = Dispatcher.query.filter_by(email=data.get('email')).first()
        phone_exists = Dispatcher.query.filter_by(phoneNum=data.get('phoneNumber')).first()
        id_exists = Dispatcher.query.filter_by(id=data.get('id')).first()

    elif user_role == "technician":
        email_exists = Technician.query.filter_by(email=data.get('email')).first()
        phone_exists = Technician.query.filter_by(phoneNum=data.get('phoneNumber')).first()
        id_exists = Technician.query.filter_by(id=data.get('id')).first()

    else: 
        return jsonify({"message": "Registration Faild"}), 409
    

    if email_exists:
        return jsonify({"message": "Email already registered", "field": "email"}), 409,
    if phone_exists:
        return jsonify({"message": "Phone number already registered", "field": "phone"}), 409,
    if id_exists:
        return jsonify({"message": "ID already registered", "field": "id"}), 409,

    password = data.get('password')
    hashedPassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(15)).decode('utf-8')


    user_instance = Users(email=data.get('email'),
                          password=hashedPassword,
                          role=user_role)
    if user_role == "dispatcher": 
        worker_instance = Dispatcher(id=data.get('id'),
                               firstName=data.get('firstName'),
                               lastName=data.get('lastName'),
                               email=data.get('email'),
                               phoneNum=data.get('phoneNumber'),
                               password=hashedPassword)
    else: 
        worker_instance = Technician(id=data.get('id'),
                               firstName=data.get('firstName'),
                               lastName=data.get('lastName'),
                               email=data.get('email'),
                               phoneNum=data.get('phoneNumber'),
                               password=hashedPassword)


    db.session.add(worker_instance)
    db.session.add(user_instance)
    db.session.commit()
    return jsonify({"message": "Registration successful"}), 200

@auth_bp.post('/contact-us')
def contact_us_email():
    import os
    
    data = request.get_json()
    
    try:
        message = Mail(
            from_email=os.environ.get('MAIL_DEFAULT_SENDER'),
            to_emails="itaydo@ac.sce.ac.il",
            subject=data.get('title'),
            plain_text_content=data.get('description')
        )
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        sg.send(message)
        return jsonify({"message": "Submission completed successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal server error"}), 500
    
    
    

