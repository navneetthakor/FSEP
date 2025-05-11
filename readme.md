# Local setup process

## cloning repose
clone follwoing repositories from my profile

```
FSEP
```
```
FSEPAlertSystem
```
```
FSEPMasterPod
```
```
FSEPWorkerPod
```

## tools that required

```
    Node.js
    Visual Studio (with asp.net core and .NET tools)
    Prometheus
    PushGateWay
    Docker
    Kafka (as docker image)
    ZooKeeper (as docker image)
```

## External required setup

- Email (APP key from google)
    - Here we need to genrate APP Key for any of our Google Email address, so that our backend can use this to send enails.
    - detail steps can be found easly on google (here not providing because this instructions changes frequently).

- Azure account
    - create account on Azure and get following id and secrets ready which used in Email service
        - Tenant ID
        - client ID
        - client secret
- Cloudinary
    - Create account on Cloudinary and get following infor used in user-management service
        - cloud_name
        - api_key
        - api_secret
- Grafana related secrets you can generate my creating account setup on grafana but that is very 
    difficult therefore those secrets i am sharing with email. (Only ment for my supervices)


# frontend setup
- For Frontend Setup, go to the following path
    ```
    FSEP/WPS_Frontend/wps_ui
    ```

- now run following commands
    ```
    npm i
    ```

- create ```.env``` file and put following content in it at root level
    ```
    VITE_BACKEND_URL="http://localhost:5002"
    ```

- now run frontend
    ```
    npm run dev
    ```


# Backend Setups

## User Management Service
- Go to the following path
    ```
    FSEP/UserManagement
    ```

- now run following commands
    ```
    npm i
    ```

- create ```.env``` file and put following content in it at root level
    Here, where <put-your-data> is there at those places put your data.
    ```
    MONGO_URI= 'mongodb+srv://webdevwithnavneet:tonystarkismyrolemodel@usermanagementwps.j0isw.mongodb.net/?retryWrites=true&w=majority&appName=UserManagementWPS'
    JWT_SECRET = 'TonyStark-is-my-role-model'
    SELF_URL = 'http://localhost:5002'
    PORT = '5002'
    CLOUD_NAME = <put-your-data-cloudinary>
    API_KEY = <put-your-data-cloudinary>
    API_SECRET = <put-your-data-cloudinary>
    EMAIL_USER = <put-your-data-email>
    EMAIL_PASS = <put-your-data-email-APPKEY>
    FRONTEND_URL = 'http://localhost:5173'

    MICROSOFT_CLIENT_ID =<put-your-data-microsoft-client-id>
    MICROSOFT_CLIENT_SECRET = <put-your-data-microsoft-client-secret>
    BACKEND_URL = "https://fsep-navneetkumar-ramanbhai-thakors-projects.vercel.app"
    FRONTEND_URL = "http://localhost:5173"
    SESSION_SECRET = <put-your-data-session-secret>
    WORKER_POD_URL = "http://localhost:5004"

    GRAFANA_URL = "https://codewithnavneet.grafana.net"
    GRAFANA_API_KEY = <grafana-secret-sent-with-email>
    ```

- now run this service
    ```
    npm run test
    ```

## Kafka setup
- pull following images from ```docker-hub```
    1. confluentinc/cp-kafka:latest
    2. confluentinc/cp-zookeeper:latest

- now create ```kafak_docker_compose.yaml``` file and and put following data in that.
    ```
    services:
      zookeeper:
        image: confluentinc/cp-zookeeper
        container_name: zookeeper
        ports:
          - 2181:2181
        environment:
          - ZOOKEEPER_CLIENT_PORT=2181
          - ZOOKEEPER_TICK_TIME=2000
        networks:
          - kafka

      kafka:
        image: confluentinc/cp-kafka
        container_name: kafka
        ports:
          - 9092:9092
        environment:
          - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
          - KAFKA_BROKER_ID=1
          - KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
          - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
        networks:
          - kafka

    networks:
      kafka:
    ```

- run this docker-compose file 
    ```
    docker compose -f ./kafak_docker_compose.yml up
    ```

## Prometheus and pushGateWay setup

- create file with name ```prometheus.yaml``` and put following data in that

    ```
    # my global config
    global:
      scrape_interval: 15s  # Set the scrape interval to every 15 seconds. Default is every 1 minute.
      evaluation_interval: 15s  # Evaluate rules every 15 seconds. The default is every 1 minute.

    # Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
    rule_files:
      # - "first_rules.yml"
      # - "second_rules.yml"

    # A scrape configuration containing exactly one endpoint to scrape:
    # Here it's Prometheus itself.
    scrape_configs:
      # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
      - job_name: "prometheus"

        # metrics_path defaults to '/metrics'
        # scheme defaults to 'http'.
        static_configs:
          - targets: ["prometheus:9090"]

      - job_name: "pushgateway"
        honor_labels: true  # Keeps labels set by Pushgateway
        static_configs:
          - targets: ["localhost:9091"]

    # Push data to Grafana Cloud instance
    remote_write:
      - url: https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom/push
        basic_auth:
          username: 2368414
          password: <grafana-Push-API-Password>
    ```

- now start prometheus with following command
    ```
    prometheus --config.file=prometheus.yml
    ```

- also start ```pushgateway``` with following command
    ```
    pushgateway
    ```


## worker-pod Service
- Go to the following path
    ```
    FSEPWorkerPod
    ```
- double  click on ```.sln``` file and open it with ```visual studio```

- create ```.env``` file and put following data in that,
    ```
    pushGateWay_URL=http://localhost:9091
    kafka_Bootstrap_server=localhost:9092
    user_management_URL=http://localhost:5002/
    ```

- now run this system

## alerting service
- Go to the following path
    ```
    FSEPAlertSystem
    ```
- double  click on ```.sln``` file and open it with ```visual studio```

- create ```.env``` file and put following data in that,
    ```
    APP_PASSWORDS=<put-your-data-email-APP_PASSWORD>
    MY_EMAIL=<put-your-data-email>
    MY_USER_SERVICE_URL=http://localhost:3000
    AZURE_CLIENT_ID=<put-your-data-azure-client-id>
    AZURE_CLIENT_SECRET=<put-your-data-azuer-client-secret>
    AZURE_TENANT_ID=<put-your-data-azure-tenant-id>
    ```

- now run this system


## Master Service (optional)
- This service is just checking that every other is working or not so if you not have enough place then you can left out it

- Go to the following path
    ```
    FSEPMasterPod
    ```
- double  click on ```.sln``` file and open it with ```visual studio```
- run this solution
