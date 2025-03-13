# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend_fastapi directory to /app (not inside another directory)
COPY backend_fastapi /app/backend_fastapi

# Set environment variables
ENV PORT=8080

# Set working directory to the src directory
WORKDIR /app/backend_fastapi/src

# Command to run the application
CMD exec gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app