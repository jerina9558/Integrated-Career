pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/jerina9558/Student-Portal.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        // stage('Test') {
        //     steps {
        //         dir('backend') {
        //             bat 'npm test'
        //         }
        //     }
        // }

        stage('Deploy') {
            steps {
                echo 'Deployment successful! (Placeholder for real deployment script)'
            }
        }
    }

    post {
        success {
            echo 'Build and deploy completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
