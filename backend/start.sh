#!/bin/bash
set -e

echo "Starting Celery worker in background..."
celery -A backend worker --loglevel=info --pool=solo &

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting gunicorn (ASGI via uvicorn worker)..."
exec gunicorn -k uvicorn.workers.UvicornWorker backend.asgi:application --bind 0.0.0.0:${PORT:-8000}