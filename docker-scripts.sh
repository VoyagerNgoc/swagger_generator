#!/bin/bash

# Make this script executable with: chmod +x docker-scripts.sh

case "$1" in
  build)
    echo "Building Docker image..."
    docker-compose build
    ;;
  up)
    echo "Starting containers..."
    docker-compose up -d
    ;;
  down)
    echo "Stopping containers..."
    docker-compose down
    ;;
  logs)
    echo "Showing logs..."
    docker-compose logs -f
    ;;
  restart)
    echo "Restarting containers..."
    docker-compose restart
    ;;
  *)
    echo "Usage: $0 {build|up|down|logs|restart}"
    exit 1
    ;;
esac

exit 0
