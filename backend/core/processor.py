import numpy as np
import pandas as pd
from collections import deque
from typing import List, Dict, Any
import logging
from .tda import TopologyAnalyzer
from .ml import AnomalyDetector
from .security import ThreatClassifier
from ..database.models import AnomalyLogModel
from datetime import datetime

logger = logging.getLogger("topoforge.processor")

class DataProcessor:
    def __init__(self, window_size: int = 50):
        self.window_size = window_size
        self.event_buffer = deque(maxlen=window_size)
        self.tda = TopologyAnalyzer()
        self.ml = AnomalyDetector()
        self.security = ThreatClassifier()
        self.is_calibrated = False
        self.anomaly_model = AnomalyLogModel()

    def ingest(self, event: Dict[str, Any]):
        """
        Ingest a single event into the buffer.
        """
        try:
            val = float(event.get('value', 0))
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

    async def process_window(self) -> Dict[str, Any]:
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
        ml_result = self.ml.predict(data[-1].reshape(1, -1))
        
        # 3. Security Classification
        security_context = self.security.classify({
            "anomaly_score": ml_result['severity'],
            "betti_numbers": betti
        })
        
        result = {
            "betti_numbers": betti,
            "anomaly_score": float(ml_result['severity']),
            "is_anomaly": bool(ml_result['is_anomaly']),
            "security_analysis": security_context,
            "window_size": len(data),
            "timestamp": datetime.utcnow()
        }
        
        # Log to Database if anomaly or periodically
        # Logic: always log anomalies, maybe sample normals
        if result["is_anomaly"]:
            try:
                await self.anomaly_model.create_log({
                    "timestamp": result["timestamp"],
                    "source_type": "stream_processor",
                    "event_data": {"recent_values": data[-5:].tolist()}, # Store last few points
                    "betti_h0": betti.get("h0", 0),
                    "betti_h1": betti.get("h1", 0),
                    "betti_h2": betti.get("h2", 0),
                    "anomaly_score": result["anomaly_score"],
                    "is_anomaly": True,
                    "metadata": security_context
                })
            except Exception as e:
                logger.error(f"Failed to save anomaly log: {e}")
        
        return result
