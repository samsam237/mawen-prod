FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc libjpeg62-turbo-dev curl wget && rm -rf /var/lib/apt/lists/* && \
    wget https://dl.min.io/client/mc/release/linux-amd64/mc -O /usr/local/bin/mc && \
    chmod +x /usr/local/bin/mc
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN chmod +x start-app.sh
RUN useradd -m appuser && chown -R appuser /app
USER appuser
EXPOSE 8080
CMD ["gunicorn","--config","gunicorn_config.py","run:app"]
