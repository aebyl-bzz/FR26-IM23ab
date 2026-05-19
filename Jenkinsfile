pipeline {
    agent any

    environment {
        PROJECT_NAME = "fr26-im23ab"
        BASE_URL = "http://54.80.83.95"
        DB_USER = "appuser"
        DB_PASSWORD = "apppassword"
        DB_NAME = "appdb"
        DB_PORT = "5432"
        BACKEND_PORT = "5000"
    }

    stages {
        stage('Prepare Names') {
            steps {
                script {
                    env.SAFE_BRANCH = (env.BRANCH_NAME ?: 'main').toLowerCase().replaceAll('[^a-z0-9_.-]', '-')
                    env.BACKEND_CONTAINER = "${env.PROJECT_NAME}_${env.SAFE_BRANCH}_backend"
                    env.DB_CONTAINER = "${env.PROJECT_NAME}_${env.SAFE_BRANCH}_db"
                    env.DB_VOLUME = "${env.PROJECT_NAME}_${env.SAFE_BRANCH}_db_data"
                    env.PUBLIC_BASE_URL = "${env.BASE_URL}/api/${env.PROJECT_NAME}/${env.SAFE_BRANCH}"
                }
            }
        }

        stage('Start Database') {
            steps {
                sh '''
                    docker network inspect infra-net >/dev/null 2>&1 || docker network create infra-net

                    docker stop "$DB_CONTAINER" || true
                    docker rm "$DB_CONTAINER" || true

                    docker run -d \
                      --name "$DB_CONTAINER" \
                      --network infra-net \
                      -e POSTGRES_USER="$DB_USER" \
                      -e POSTGRES_PASSWORD="$DB_PASSWORD" \
                      -e POSTGRES_DB="$DB_NAME" \
                      -v "$DB_VOLUME:/var/lib/postgresql/data" \
                      postgres:17
                '''
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                    docker build -t "$BACKEND_CONTAINER" .
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    docker stop "$BACKEND_CONTAINER" || true
                    docker rm "$BACKEND_CONTAINER" || true

                    docker run -d \
                        --name "$BACKEND_CONTAINER" \
                        --network infra-net \
                        -e PORT="$BACKEND_PORT" \
                        -e PUBLIC_BASE_URL="$PUBLIC_BASE_URL" \
                        -e DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_CONTAINER:$DB_PORT/$DB_NAME" \
                        "$BACKEND_CONTAINER"
                '''
            }
        }

        stage('Smoke Check') {
            steps {
                sh '''
                    sleep 5
                    curl --fail --silent --show-error "$BASE_URL/api/$PROJECT_NAME/$SAFE_BRANCH/health" >/dev/null
                    echo "Backend URL: $BASE_URL/api/$PROJECT_NAME/$SAFE_BRANCH/api/shorten"
                '''
            }
        }
    }
}
