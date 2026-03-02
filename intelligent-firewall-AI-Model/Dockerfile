# Use an official Python image from DockerHub
FROM python:3.8-slim

# Install PyTorch and any other dependencies
RUN pip install torch scikit-learn numpy

# Set the working directory inside the container
WORKDIR /opt/ml

# Copy your Lambda function and model files into the container
COPY lambda_function.py /opt/ml/
COPY bilstm_model.pth /opt/ml/model/

# Set the Lambda runtime API entry point
CMD ["lambda_function.lambda_handler"]
