

def test_get_user_by_reporter(client, token, users, report, _db):
    tok = token('cit@example.com')
    response = client.get('/report/reporter/123456789', headers={
        'Authorization': f'Bearer {tok}',
        'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert response.json[0]['data'] == 'test data'


def test_add_new_report(client, token, users):
    tok = token('cit@example.com')
    headers = {
        'Authorization': f'Bearer {tok}',
        'Content-Type': 'application/json'
    }
    data = {
        "id": '123456789',
        "data": 'data for add test',
        "location": 'location for test add',
        "image": ''
    }
    response = client.post('/report/new', headers=headers, json=data)
    assert response.status_code == 200
    assert response.json['data'] == 'New report created'


def test_get_fixed_by_year(client, token, report, users, _db):
    tok = token('cit@example.com')
    response = client.get('/report/fixed/2024', headers={
        'Authorization': f'Bearer {tok}',
        'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert response.json[0]['data'] == 'test data'


def test_edit_report(client, token):
    tok = token('cit@example.com')
    headers = {
        'Authorization': f'Bearer {tok}',
        'Content-Type': 'application/json'
    }
    data = {
        "id": '123456789',
        "data": 'data for add test',
        "location": 'location for test edit',
        "image": ''
    }
    response = client.post('/report/edit/1', headers=headers, json=data)
    assert response.status_code == 200
    assert response.json['data'] == 'Report edited.'
    

def test_create_new_disp_report(_db, client, token, dispatcher, sensorData):
    tok = token('cit@example.com')
    headers = {
        'Authorization': f'Bearer {tok}',
        'Content-Type': 'application/json'
    }

    data = {
        "id": dispatcher.id,
        "data": 'data for add test',
        "location": 'location for test add',
        "image": '',
        "sensorId": 1
    }
    print(sensorData.id)
    response = client.post('/report/dispatcher/new', headers=headers, json=data)
    assert response.status_code == 200
    assert response.json['data'] == 'New report created'
