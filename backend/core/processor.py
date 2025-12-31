import numpy as np
import pandas as pd
from collections import deque
from typing import List, Dict, Any
import logging
from .tda import TopologyAnalyzer
from .ml import AnomalyDetector
from .security import ThreatClassifier

logger = logging.getLogger("topoforge.processor")

class DataProcessor:
    def __init__(self, window_size: int = 50):
        self.window_size = window_size
        self.event_buffer = deque(maxlen=window_size)
        self.tda = TopologyAnalyzer()
        self.ml = AnomalyDetector()
        self.security = ThreatClassifier()
        self.is_calibrated = False

    def ingest(self, event: Dict[str, Any]):
        """
        Ingest a single event into the buffer.
        """
        # Feature Extraction (Simple heuristic for now)
        # We expect event to have 'timestamp', 'value', 'metadata'
        try:
            # Create a numerical vector [value, time_delta_from_prev]
            # This is a placeholder. In real life, use robust embedding.
            val = float(event.get('value', 0))
            
            # Simple vector: [value, random_noise_for_demo_geometry]
            # We add noise to make TDA interesting if data is 1D
            vector = [val, np.random.normal(0, 0.1)] 
            
            self.event_buffer.append(vector)
            
            if len(self.event_buffer) >= self.window_size and not self.is_calibrated:
                self._calibrate()
                
        except Exception as e:
            logger.error(f"Ingestion error: {e}")

    def _calibrate(self):
        """Train initial models on the first full window."""
        data = np.array(self.event_buffer)
        self.ml.train(data)
        self.is_calibrated = True
        logger.info("System calibrated on initial data window.")

    def process_window(self) -> Dict[str, Any]:
        """
        Run TDA and ML on the current window.
        """
        if len(self.event_buffer) < 10:
            return {"status": "buffering", "count": len(self.event_buffer)}

        data = np.array(self.event_buffer)
        
        # 1. TDA Analysis
        diagrams = self.tda.compute_persistence(data)
        betti = self.tda.extract_betti_numbers(diagrams)
        
        # 2. ML Anomaly Detection
        ml_result = self.ml.predict(data[-1].reshape(1, -1)) # Predict on latest point
        
        # 3. Security Classification
        security_context = self.security.classify({
            "anomaly_score": ml_result['severity'],
            "betti_numbers": betti
        })
        
        return {
            "betti_numbers": betti,
            "anomaly_score": ml_result['severity'],
            "is_anomaly": ml_result['is_anomaly'],
            "security_analysis": security_context,
            "window_size": len(data)
        }
