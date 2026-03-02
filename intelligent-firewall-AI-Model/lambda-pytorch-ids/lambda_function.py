import torch
import torch.nn as nn
import numpy as np
import json
from sklearn.preprocessing import LabelEncoder

# Check for CUDA (GPU) support or fallback to CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Define the BiLSTM model class
class BiLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, num_classes):
        super(BiLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, bidirectional=True)
        self.fc = nn.Linear(hidden_size * 2, num_classes)  # bidirectional output
        self.dropout = nn.Dropout(0.2)

    def forward(self, x):
        # Initial hidden state and cell state
        h0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size).to(device)
        c0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size).to(device)
        
        # LSTM forward pass
        x = x.unsqueeze(1)  # Add sequence dimension (1 sequence length)
        out, _ = self.lstm(x, (h0, c0))
        out = self.dropout(out[:, -1, :])  # Take the last time step
        out = self.fc(out)  # Pass through fully connected layer
        return out

# Load the model (make sure the model is at the correct path)
model = BiLSTM(input_size=78, hidden_size=128, num_layers=2, num_classes=15)  # 15 classes for your problem
model.load_state_dict(torch.load('bilstm_model.pth', map_location=device))  # Load model to the appropriate device (CPU/GPU)
model.eval()  # Set the model to evaluation mode

# Define the LabelEncoder (using the actual class labels from your data)
label_encoder = LabelEncoder()
label_encoder.fit([
    'BENIGN', 'DDoS', 'PortScan', 'Bot', 'Infiltration',
    'Web Attack - Brute Force', 'Web Attack - XSS',
    'Web Attack - Sql Injection', 'FTP-Patator', 'SSH-Patator',
    'DoS slowloris', 'DoS Slowhttptest', 'DoS Hulk', 'DoS GoldenEye',
    'Heartbleed'
])  # The unique class labels for classification

def lambda_handler(event, context):
    # Extract features from the incoming event (expects an array of features)
    features = np.array(event['features']).reshape(1, -1)  # Ensure it's a 2D array with 1 sample
    features = torch.tensor(features, dtype=torch.float32).to(device)  # Convert to tensor and send to device (CPU/GPU)
    
    with torch.no_grad():  # No gradient calculation required during inference
        output = model(features)  # Pass through the model
        _, predicted = torch.max(output, 1)  # Get the index of the max output value (prediction)

    # Decode the predicted index to the class label
    prediction = label_encoder.inverse_transform([predicted.item()])  # Convert to human-readable label

    # Return the prediction result as a response
    return {
        'statusCode': 200,
        'body': json.dumps({'prediction': prediction[0]})  # Return the predicted class
    }

