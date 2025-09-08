#!/bin/bash

echo "Attente de MinIO..."
until curl -f http://mawen-minio:9000/minio/health/live; do
  echo "MinIO pas encore prêt, attente..."
  sleep 2
done

echo "MinIO est prêt, attente de l'initialisation complète..."
sleep 15

echo "Tentative de création du bucket..."
# Attendre que MinIO soit complètement prêt pour les credentials
until mc alias set local http://mawen-minio:9000 minioadmin minioadmin; do
  echo "Attente des credentials MinIO..."
  sleep 3
done

echo "Authentification réussie, création du bucket..."
mc mb local/mawenhouse --ignore-existing
echo "Bucket mawenhouse créé!"

echo "Démarrage de l'application..."
exec gunicorn --bind 0.0.0.0:8080 --workers 2 --threads 4 --worker-class gthread run:app
