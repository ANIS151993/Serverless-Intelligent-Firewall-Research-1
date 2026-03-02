import json
import torch
import torch.nn as nn
import numpy as np
import boto3
import os

# BiLSTM Model class (must match your training architecture)
class BiLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, num_classes):
        super(BiLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, 
                          batch_first=True, bidirectional=True)
        self.fc = nn.Linear(hidden_size * 2, num_classes)
        self.dropout = nn.Dropout(0.2)
    
    def forward(self, x):
        h0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size)
        c0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size)
        
        x = x.unsqueeze(1)
        out, _ = self.lstm(x, (h0, c0))
        out = self.dropout(out[:, -1, :])
        out = self.fc(out)
        return out

# Model parameters (must match your training parameters)
input_size = 78  # Update this to match your dataset features
hidden_size = 128
num_layers = 2
num_classes = 8  # Update to match your CICIDS2017 classes

# Initialize model
model = None

def load_model():
    global model
    
    # Initialize model
    model = BiLSTM(input_size, hidden_size, num_layers, num_classes)
    
    # Load model from S3
    s3 = boto3.client('s3')
    bucket_name = os.environ['bilstm-models']
    model_key = os.environ['bilstm_model.pth']
    
    try:
        s3.download_file(bucket_name, model_key, '/tmp/model.pth')
        model.load_state_dict(torch.load('/tmp/model.pth', map_location=torch.device('cpu')))
        model.eval()
        return True
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return False

def lambda_handler(event, context):
    # Load model if not loaded
    global model
    if model is None:
        success = load_model()
        if not success:
            return {
                'statusCode': 500,
                'body': json.dumps('Failed to load model')
            }
    
    try:
        # Parse input
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            body = event
            
        # Get features
        features = body.get('features', [])
        
        # Check input
        if not features:
            return {
                'statusCode': 400,
                'body': json.dumps('Missing features in request')
            }
            
        # Convert to tensor
        input_tensor = torch.FloatTensor([features])
        
        # Make prediction
        with torch.no_grad():
            outputs = model(input_tensor)
            _, predicted = torch.max(outputs.data, 1)
            
        # Define class names (update with your actual class names)
        class_names = [
            "BENIGN", 
            "DoS Hulk", 
            "PortScan", 
            "DDoS", 
            "DoS GoldenEye", 
            "FTP-Patator", 
            "SSH-Patator", 
            "DoS slowloris"
        ]  # Update with your CICIDS2017 classes
        
        predicted_class = class_names[predicted.item()]
            
        # Prepare response
        response = {
            'prediction': predicted.item(),
            'class_name': predicted_class,
            'confidence': outputs[0][predicted.item()].item()
        }
        
        return {
            'statusCode': 200,
            'body': json.dumps(response)
        }
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error during prediction: {str(e)}')
        }