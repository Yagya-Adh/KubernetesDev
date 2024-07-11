#!/bin/bash

docker network create my-net
node index.js --net=my-net
