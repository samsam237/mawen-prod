#!/bin/bash

echo "Attente de MinIO..."
until curl -f http://mawen-minio:9000/minio/health/live; do
  echo "MinIO pas encore prêt, attente..."
  sleep 2
done

echo "MinIO est prêt, création du bucket..."
until mc alias set local http://mawen-minio:9000 minioadmin minioadmin && mc mb local/mawenhouse --ignore-existing; do
  echo "Tentative de création du bucket..."
  sleep 2
done

echo "Bucket créé, démarrage de l'application..."
exec gunicorn --bind 0.0.0.0:8080 --workers 2 --threads 4 --worker-class gthread run:app
