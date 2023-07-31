#!/bin/bash
docker images | grep -v $1 | awk '{print $1":"$2}' | xargs docker rmi -f
