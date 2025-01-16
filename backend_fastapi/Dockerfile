# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV PORT=8080

# Command to run the application
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT}
# CMD exec python -m uvicorn app:app --host 0.0.0.0 --port ${PORT}

