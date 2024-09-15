import json
from flask import jsonify
from sendgrid import SendGridAPIClient
from unittest.mock import patch, Mock
import os
from sendgrid.helpers.mail import Mail


def test_login(client, citizen, users, _db):
    data = {
        "email": 'cit@example.com',
        "password": 'Test1234'
    }
    response = client.post('/auth/login', json=data)
    print(response.json)
    assert response.status_code == 200
    assert response.json['userToken'] is not None


def test_register(client):
    data = {
        'firstName': 'firstName',
        'lastName': 'lastName',
        'email': 'email@email.com',
        'phoneNumber': '1111111111',
        'address': 'address',
        'password': 'password',
        'id': '111111111'
    }
    response = client.post('/auth/register', json=data)
    assert response.status_code == 200
    assert response.json['message'] == 'Registration successful'


def test_get_user_by_token(client, token, users):
    tok = token('cit@example.com')
    headers = {
        'Authorization': f'Bearer {tok}',
        'Content-Type': 'application/json'
    }

    response = client.get('/auth/home', headers=headers)
    assert response.status_code == 200


def test_get_user_data(client, token, users):
    tok = token('cit@example.com')
    headers = {
        'Authorization': f'Bearer {tok}',
        'Content-Type': 'application/json'
    }

    response = client.get('/auth/getUserData', headers=headers)
    assert response.status_code == 200


def test_edit_profile(client, token):
    tok = token('cit@example.com')
    headers = {
        'Authorization': f'Bearer {tok}',
        'Content-Type': 'application/json'
    }

    data = {
        'firstName': 'firstName',
        'lastName': 'lastName',
        'email': 'cit@example.com',
        'phoneNumber': '0501234567',
        'address': 'address',
        'id': '123456789',
        'newPassword': 'Test1234'
    }

    response = client.post('/auth/editProfile', headers=headers, json=data)
    assert response.status_code == 200
    assert response.json['message'] == 'Profile updated successfully'


def test_logout(client, token):
    tok = token('cit@example.com')
    headers = {
        'Authorization': f'Bearer {tok}',
        'Content-Type': 'application/json'
    }

    response = client.post('/auth/logout', headers=headers)
    assert response.status_code == 200
    assert response.json['message'] == 'Logout successfully'


def test_contact_us_email_success(client):
    # Arrange
    data = {
        'title': 'Test Email',
        'description': 'This is a test email description.'
    }


    response = client.post('/auth/contact-us',  json=data)

    # Assert
    assert response.status_code == 200
    assert response.json == {"message": "Submission completed successfully"}


def test_contact_us_email_fail(client):
    # Arrange
    data = {
        'title': 'Test Email'
    }


    response = client.post('/auth/contact-us',  json=data)

    # Assert
    assert response.status_code == 500
    assert response.json == {"message": "Internal server error"}