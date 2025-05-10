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

## for email sending purpose

- Here we need to genrate APP Key for any of our Google Email address, so that our backend can use this to send enails.
- detail steps can be found easly on google (here not providing because this instructions changes frequently).




# frontend setup
- For Frontend Setup, went to the following path
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


# Backedn Setups

## User Management Service

