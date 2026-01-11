import pytest
import numpy as np
from backend.core.tda import TopologyAnalyzer

class TestPersistenceLandscape:
    
    def test_landscape_computation(self):
        tda = TopologyAnalyzer()
        
        # Case 1: Empty diagrams
        res = tda.compute_persistence_landscape([])
        assert res["x"] == []
        assert res["y"] == []
        
        # Case 2: No H1 features
        # Diagram: [H0, H1]
        dgm = [np.array([[0, np.inf]]), np.array([])]
        res = tda.compute_persistence_landscape(dgm)
        assert res["x"] == []
        assert res["y"] == []
        
        # Case 3: Single H1 feature (1, 3)
        # Triangle function: max(0, min(t-1, 3-t))
        # Peak at t=2, height=1
        dgm = [np.array([[0, np.inf]]), np.array([[1, 3]])]
        res = tda.compute_persistence_landscape(dgm, resolution=5)
        
        assert len(res["x"]) == 5
        assert len(res["y"]) == 5
        assert max(res["y"]) > 0
        
        # Check peak approximation
        # t_vals will cover range around [1, 3]
        # Peak should be near 1.0
        assert max(res["y"]) <= 1.0 # Theoretical max is (d-b)/2 = 1.0

    def test_landscape_multiple_features(self):
        tda = TopologyAnalyzer()
        # Two features: (1, 5) and (2, 4)
        # (1, 5) -> Peak at 3, height 2
        # (2, 4) -> Peak at 3, height 1
        # Max envelope should follow the larger triangle (1, 5) mostly
        dgm = [np.array([[0, np.inf]]), np.array([[1, 5], [2, 4]])]
        res = tda.compute_persistence_landscape(dgm, resolution=20)
        
        assert max(res["y"]) > 1.5 # Should be close to 2.0
