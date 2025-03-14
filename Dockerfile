# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY backend_fastapi/requirements.txt .
 

# # In your Dockerfile, make sure the app has permission to access credentials
# RUN mkdir -p /root/.config/gcloud

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend_fastapi directory to /app (not inside another directory)
COPY /backend_fastapi /app/backend_fastapi

# Set environment variables
ENV PORT=8080
ENV ENVIRONMENT=remote
ENV CONFIG_PATH=../config.yaml

# Set working directory to the src directory
WORKDIR /app/backend_fastapi/src

# Command to run the application
CMD exec gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app