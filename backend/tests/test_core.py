import pytest
import numpy as np
from core.tda import TopologyAnalyzer
from core.ml import AnomalyDetector
from core.security import ThreatClassifier
from core.processor import DataProcessor

# --- TDA Tests ---
def test_tda_betti_numbers():
    tda = TopologyAnalyzer()
    
    # Create a simple circle (should have H1=1)
    t = np.linspace(0, 2*np.pi, 20)
    circle = np.column_stack((np.cos(t), np.sin(t)))
    
    diagrams = tda.compute_persistence(circle)
    betti = tda.extract_betti_numbers(diagrams, threshold=0.1)
    
    assert betti['h1'] >= 1, "Should detect at least one loop"

# --- ML Tests ---
def test_ml_anomaly_detection():
    detector = AnomalyDetector()
    
    # Train on normal data (gaussian blob)
    normal_data = np.random.normal(0, 1, (100, 2))
    detector.train(normal_data)
    
    # Test normal point
    normal_point = np.array([[0.1, 0.1]])
    res_normal = detector.predict(normal_point)
    assert not res_normal['is_anomaly'], "Normal point should not be anomaly"
    
    # Test outlier
    outlier = np.array([[10.0, 10.0]])
    res_outlier = detector.predict(outlier)
    assert res_outlier['is_anomaly'], "Outlier should be detected"

# --- Security Tests ---
def test_security_classification():
    classifier = ThreatClassifier()
    
    # Test Critical Risk
    high_risk_input = {
        "anomaly_score": 0.9,
        "betti_numbers": {"h0": 5, "h1": 10}
    }
    result = classifier.classify(high_risk_input)
    assert result['risk_level'] == 'Critical'
    assert len(result['threats']) >= 1
    
    # Test Low Risk
    low_risk_input = {
        "anomaly_score": 0.1,
        "betti_numbers": {"h0": 1, "h1": 0}
    }
    result_low = classifier.classify(low_risk_input)
    assert result_low['risk_level'] == 'Low'

# --- Processor Integration Test ---
def test_processor_flow():
    processor = DataProcessor(window_size=20)
    
    # Ingest enough data to calibrate
    for i in range(25):
        processor.ingest({"value": np.sin(i/10), "timestamp": "2024-01-01"})
        
    assert processor.is_calibrated
    
    # Process a window
    result = processor.process_window()
    assert "betti_numbers" in result
    assert "security_analysis" in result
    assert result['security_analysis']['risk_level'] in ['Low', 'Medium', 'High', 'Critical']
