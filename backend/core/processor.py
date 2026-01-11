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
        self.config = {
            "anomaly_threshold": 65.0
        }

    def update_config(self, new_config: Dict[str, Any]):
        """Update processor configuration dynamically."""
        self.config.update(new_config)
        logger.info(f"Processor config updated: {self.config}")

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
        entropy = self.tda.compute_persistence_entropy(diagrams)
        total_lifetime = self.tda.compute_total_lifetime(diagrams)
        landscape = self.tda.compute_persistence_landscape(diagrams)
        
        # 2. ML Anomaly Detection
        ml_result = self.ml.predict(data[-1].reshape(1, -1))
        ml_score = float(ml_result['severity'])
        
        # 3. Anomaly Scoring Logic
        # Weights: Betti (Structure) = 40%, Entropy (Chaos) = 30%, ML (Statistical) = 30%
        
        # Calculate Betti deviation (simple sum of H0+H1+H2)
        current_betti_sum = sum(betti.values())
        # Assuming baseline is roughly 1 component (H0=1) for stable data
        betti_score = min(abs(current_betti_sum - 1) * 20, 100) 
        
        # Calculate Entropy score (higher entropy = more noise/anomalous)
        # Normalize entropy (heuristic: > 5.0 is very high)
        entropy_score = min(entropy * 20, 100)
        
        # Normalize ML score (assuming it's roughly 0-1, scale to 0-100)
        # Isolation Forest score is usually negative, we inverted it to positive.
        # It can be > 1 or < 0 depending on implementation, but usually around 0.5 is threshold.
        ml_score_norm = min(max(ml_score * 100 + 50, 0), 100)
        
        # Weighted Sum
        final_score = (0.4 * betti_score) + (0.3 * entropy_score) + (0.3 * ml_score_norm)
        
        # Determine anomaly status based on score
        threshold = self.config.get("anomaly_threshold", 65.0)
        is_anomaly = final_score > threshold
        
        # 4. Security Classification
        security_context = self.security.classify({
            "anomaly_score": final_score,
            "betti_numbers": betti,
            "entropy": entropy
        })
        
        result = {
            "betti_numbers": betti,
            "topology_features": {
                "entropy": float(entropy),
                "total_lifetime": float(total_lifetime),
                "landscape": landscape
            },
            "scores": {
                "total": float(final_score),
                "betti": float(betti_score),
                "entropy": float(entropy_score),
                "ml": float(ml_score_norm)
            },
            "anomaly_score": float(final_score),
            "is_anomaly": is_anomaly,
            "security_analysis": security_context,
            "window_size": len(data),
            "timestamp": datetime.utcnow()
        }
        
        # Log to Database if anomaly or periodically
        if result["is_anomaly"]:
            try:
                await self.anomaly_model.create_log({
                    "timestamp": result["timestamp"],
                    "source_type": "stream_processor",
                    "event_data": {"recent_values": data[-5:].tolist()},
                    "betti_h0": betti.get("h0", 0),
                    "betti_h1": betti.get("h1", 0),
                    "betti_h2": betti.get("h2", 0),
                    "anomaly_score": result["anomaly_score"],
                    "is_anomaly": True,
                    "metadata": {
                        **security_context,
                        "scores": result["scores"],
                        "topology": result["topology_features"]
                    }
                })
            except Exception as e:
                logger.error(f"Failed to save anomaly log: {e}")
        
        return result
