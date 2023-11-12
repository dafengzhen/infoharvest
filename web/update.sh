#!/bin/sh

# This is a script that conveniently updates the Docker image for the current project using default settings.
# If you have customized settings, you may need to update the script accordingly.

CONTAINER_ID="$1"

if [ "$CONTAINER_ID" = "none" ]; then
  echo "Skipping container stop and removal."
else
  docker stop "$CONTAINER_ID"
  docker rm "$CONTAINER_ID"
fi

docker build -t infoharvest-web .
docker run --restart=always -d -p 3000:3000 infoharvest-web
