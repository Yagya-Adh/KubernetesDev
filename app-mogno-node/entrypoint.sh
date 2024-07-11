#!/bin/bash

# Function to check if Docker network exists
network_exists() {
    docker network inspect "$1" > /dev/null 2>&1
}

# Check if the network exists
if ! network_exists my-net; then
    echo "Creating Docker network: my-net"
    docker network create my-net
fi

# Start your application using the network
node index.js --net=my-net
