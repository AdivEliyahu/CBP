pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [
            [name: '*/main']
          ],
          userRemoteConfigs: [
            [url: 'https://github.com/BS-PMC-2024/BS-PMC-2024-Team5.git',
            credentialsId: 'git']
          ]
        ])
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          dir('backend') {
            // Build the backend Docker image
            sh 'docker compose build --no-cache'
          }
        }
      }
    }

    stage('Run Frontend Tests') {
      steps {
        script {
          dir('client') {
            sh 'docker run --rm client npm test'
          }
        }
      }
    }

    stage('Run Backend Tests') {
      steps {
        script {
          dir('server') {
            sh 'docker run --rm server python -m pytest -v'
          }
        }
      }
    }

     stage('Run Lighthouse CI') {
            steps {
              dir('client') {
                sh 'lhci autorun'
              }
            }
        }

    // Uncomment and modify the following stage if you need to deploy with Docker Compose
    /*
    stage('Deploy with Docker Compose') {
      steps {
        script {
          // Start the services using Docker Compose
          sh 'docker-compose up -d'
        }
      }
    }
    */
  }

  post {
    always {
      script {
        // Clean up workspace and Docker containers
        sh 'docker compose down'
        cleanWs()
      }
    }
  }
}
