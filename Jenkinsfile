pipeline {
    agent any

    environment {
        IMAGE_NAME = "socialmedia-app"
        CONTAINER_NAME = "socialmedia-container"
        PORT = "4000"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node dependencies...'
                dir('SocialMedia_platform-main') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running backend tests...'
                dir('SocialMedia_platform-main') {
                    bat 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                bat "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Stop Old Container') {
            steps {
                echo 'Stopping old container if running...'
                bat """
                    docker stop ${CONTAINER_NAME} || exit 0
                    docker rm ${CONTAINER_NAME} || exit 0
                """
            }
        }

        stage('Run New Container') {
            steps {
                echo 'Starting new container...'
                bat "docker run -d -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}"
            }
        }
    }

    post {
        success {
            echo '✅ Build & Deploy SUCCESS! App running at http://localhost:4000'
        }
        failure {
            echo '❌ Build FAILED! Check logs above.'
        }
    }
}