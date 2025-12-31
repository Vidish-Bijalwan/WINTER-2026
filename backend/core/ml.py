import numpy as np
from sklearn.ensemble import IsolationForest
import torch
import torch.nn as nn
import logging

logger = logging.getLogger("topoforge.ml")

class Autoencoder(nn.Module):
    def __init__(self, input_dim: int, latent_dim: int = 10):
        super(Autoencoder, self).__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 32),
            nn.ReLU(),
            nn.Linear(32, latent_dim),
            nn.ReLU()
        )
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 32),
            nn.ReLU(),
            nn.Linear(32, input_dim),
            nn.Sigmoid() # Assuming normalized input [0,1]
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

class AnomalyDetector:
    def __init__(self, input_dim: int = 50):
        self.iso_forest = IsolationForest(contamination=0.1, random_state=42)
        self.autoencoder = Autoencoder(input_dim)
        self.is_fitted = False
        
    def train(self, data: np.ndarray):
        """
        Train the anomaly detection models.
        :param data: Normal behavior data
        """
        logger.info("Training Isolation Forest...")
        self.iso_forest.fit(data)
        
        # TODO: Train Autoencoder
        self.is_fitted = True
        logger.info("Training complete.")

    def predict(self, data: np.ndarray) -> dict:
        """
        Predict anomalies.
        :param data: New data points
        :return: Dictionary with anomaly scores and labels
        """
        if not self.is_fitted:
            logger.warning("Models not fitted. Returning default safe values.")
            return {"anomaly": False, "score": 0.0}

        # Isolation Forest Prediction (-1 = anomaly, 1 = normal)
        iso_pred = self.iso_forest.predict(data)
        iso_score = self.iso_forest.decision_function(data) # Lower is more anomalous

        # Autoencoder Reconstruction Error
        # tensor_data = torch.FloatTensor(data)
        # reconstruction = self.autoencoder(tensor_data)
        # error = torch.mean((tensor_data - reconstruction) ** 2, dim=1)

        return {
            "is_anomaly": bool(iso_pred[0] == -1),
            "severity": float(-iso_score[0]) # Invert so higher is worse
        }
