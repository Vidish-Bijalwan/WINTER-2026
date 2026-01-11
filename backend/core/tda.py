import numpy as np
from ripser import ripser
from persim import plot_diagrams
import logging

logger = logging.getLogger("topoforge.tda")

class TopologyAnalyzer:
    def __init__(self, max_dimension: int = 2):
        """
        Initialize the TDA engine.
        :param max_dimension: Maximum homology dimension to compute (0=components, 1=loops, 2=voids)
        """
        self.max_dim = max_dimension

    def compute_persistence(self, point_cloud: np.ndarray):
        """
        Compute persistent homology for a given point cloud.
        :param point_cloud: Numpy array of shape (n_samples, n_features)
        :return: Persistence diagrams
        """
        if point_cloud.shape[0] < self.max_dim + 2:
            logger.warning("Not enough points for TDA computation")
            return []

        try:
            # Compute persistence diagrams using Ripser
            # return_inverse=True allows us to map generators back to points (future feature)
            diagrams = ripser(point_cloud, maxdim=self.max_dim)['dgms']
            return diagrams
        except Exception as e:
            logger.error(f"TDA Computation failed: {str(e)}")
            return []

    def extract_betti_numbers(self, diagrams, threshold: float = 0.1) -> dict:
        """
        Extract Betti numbers (counts of features) from diagrams.
        :param diagrams: Output from compute_persistence
        :param threshold: Minimum lifetime to be considered a significant feature
        :return: Dictionary of Betti numbers {h0: int, h1: int, ...}
        """
        betti = {}
        for dim, dgm in enumerate(diagrams):
            # Filter out short-lived features (noise)
            # Lifetime = death - birth
            # Note: H0 features often have infinite death, handle carefully
            lifetimes = dgm[:, 1] - dgm[:, 0]
            
            # For H0, one component usually lives forever (inf). We count components > threshold.
            # Usually H0 is just number of connected components at epsilon=0, but persistent H0 
            # tracks merging.
            
            significant = np.sum(lifetimes > threshold)
            betti[f"h{dim}"] = int(significant)
            
        return betti
