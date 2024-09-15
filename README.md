# Project Setup Guide

## Prerequisites

- Python 3.x
- Node.js and npm
- flask 
- mySQL
- Git (optional, for cloning the repository) 
  
## DataBase Setup 


## Server Setup
 - Open new SQL table 
 - Configure .env file (server/.env) in MYSQL_USER, MYSQL_PASSWORD, MYSQL_URL, MYSQL_DB
  
### Enter the Server Directory and Set Up Virtual Environment
```bash
cd server
pip install virtualenv
python -m venv venv
```

### Activate Virtual Environment
On Windows:
```bash
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run the Server
```bash
python server.py
```

## Client Setup

### Enter the Client Directory and Install Packages
```bash
cd client
npm install
```

### Start the Client
```bash
npm start
```



# To build flask docker
## Enter to server directory and run: 
```dockerfile
docker build --no-cache -t altereitay/flask-server .
```

# To build react docker
## Enter to client directory and run: 
```dockerfile
docker build --no-cache -t altereitay/react-app .
```

# To build compose
## In the main directory run: 
```dockerfile
docker-compose build --no-cache
```

# To run compose
## In the main directory run: 
```dockerfile
docker-compose up
```

# To run python tests
## Enter to the server directory and run:
```python
python -m pytest -v
```