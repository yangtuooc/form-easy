#!/bin/bash

set -e

echo "building docker image"
docker buildx build --platform linux/amd64 -t form-easy . 

echo "saving docker image"
docker save form-easy -o form-easy.tar

echo "sending docker image to server"
rsync -avz form-easy.tar ubuntu@llamazing:~/

echo "running docker container on server"
ssh ubuntu@llamazing "docker load -i form-easy.tar && docker run -d --name form-easy -p 3001:3001 form-easy && rm form-easy.tar"

echo "cleaning up"
rm form-easy.tar
docker rmi form-easy