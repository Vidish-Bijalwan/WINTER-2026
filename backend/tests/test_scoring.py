import pytest
import numpy as np
from core.tda import TopologyAnalyzer
from core.processor import DataProcessor
from unittest.mock import MagicMock, patch

class TestAnomalyScoring:
    
    def test_entropy_calculation(self):
        tda = TopologyAnalyzer()
        
        # Case 1: Empty diagram -> 0 entropy
        assert tda.compute_persistence_entropy([]) == 0.0
        
        # Case 2: Single feature -> 0 entropy (log(1) = 0)
        # Diagram format: list of numpy arrays (one per dim)
        # Each array is (n_features, 2) -> [[birth, death], ...]
        dgm = [np.array([[0, 10]])] 
        assert tda.compute_persistence_entropy(dgm) == 0.0
        
        # Case 3: Two equal features -> log(2) entropy (max entropy for 2 items)
        # Lifetimes: 10, 10. Total = 20. Probs = 0.5, 0.5.
        # Entropy = - (0.5 * log(0.5) + 0.5 * log(0.5)) = -log(0.5) = log(2) ≈ 0.693
        dgm = [np.array([[0, 10], [2, 12]])]
        entropy = tda.compute_persistence_entropy(dgm)
        assert abs(entropy - np.log(2)) < 0.001

    @pytest.mark.asyncio
    async def test_processor_scoring(self):
        # Mock dependencies
        with patch('core.processor.TopologyAnalyzer') as MockTDA, \
             patch('core.processor.AnomalyDetector') as MockML, \
             patch('core.processor.ThreatClassifier') as MockSecurity, \
             patch('core.processor.AnomalyLogModel') as MockLog:
            
            # Setup mocks
            mock_tda = MockTDA.return_value
            mock_ml = MockML.return_value
            mock_security = MockSecurity.return_value
            
            # Scenario: High Anomaly
            # Betti sum = 5 (Baseline 1 -> diff 4 -> score 80)
            # Entropy = 3.0 (Score 60)
            # ML Score = 0.8 (Norm -> 100)
            # Weighted: 0.4*80 + 0.3*60 + 0.3*100 = 32 + 18 + 30 = 80.0
            
            mock_tda.compute_persistence.return_value = []
            mock_tda.extract_betti_numbers.return_value = {"h0": 2, "h1": 2, "h2": 1}
            mock_tda.compute_persistence_entropy.return_value = 3.0
            mock_tda.compute_total_lifetime.return_value = 100.0
            
            mock_ml.predict.return_value = {"severity": 0.8, "is_anomaly": True}
            mock_security.classify.return_value = {"level": "critical"}
            
            # Initialize processor
            processor = DataProcessor()
            # Fill buffer to avoid "buffering" state
            for _ in range(50):
                processor.ingest({"value": 1.0})
                
            # Run process_window
            result = await processor.process_window()
            
            # Verify scores
            scores = result["scores"]
            assert scores["betti"] == 80.0
            assert scores["entropy"] == 60.0
            assert scores["ml"] == 100.0
            assert scores["total"] == 80.0
            assert result["is_anomaly"] is True
