# ---- Stage 1: Build the React frontend ----
FROM node:20-slim AS frontend-build

WORKDIR /frontend

# Accept build-time variables from Railway and expose them to Vite
ARG VITE_API_URL
ARG VITE_WS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# ---- Stage 2: Python backend ----
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Copy the built React app from stage 1 into frontend_build/
COPY --from=frontend-build /frontend/dist ./frontend_build

RUN chmod +x start.sh

EXPOSE 8000

CMD ["./start.sh"]