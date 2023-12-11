#!/bin/bash

if [[ $1 = "up" || $1 = "down" ]]; then
    cd ..
    fileEnv="docker-compose.yaml"
    downOrUp=$1
    echo "Running docker-compose -f docker-compose.yaml ${downOrUp}"
    docker-compose -f docker-compose.yaml $downOrUp
else
    echo "Usage: ./deploy.sh [up|down]"
fi