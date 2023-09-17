# Use an official Python runtime as the base image
FROM python:3.8-slim-buster

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable for Gunicorn to bind
ENV GUNICORN_CMD="gunicorn --bind=0.0.0.0:8000 --workers=4 main:app"

# Run app.py using gunicorn when the container launches
CMD ["sh", "-c", "$GUNICORN_CMD"]
