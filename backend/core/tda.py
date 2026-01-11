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

    def extract_betti_numbers(self, diagrams, threshold: float = 0.1, adaptive: bool = False, sigma: float = 2.0) -> dict:
        """
        Extract Betti numbers (counts of features) from diagrams.
        :param diagrams: Output from compute_persistence
        :param threshold: Minimum lifetime to be considered a significant feature (used if adaptive=False)
        :param adaptive: If True, dynamically calculate threshold based on distribution
        :param sigma: Standard deviations above mean for adaptive threshold
        :return: Dictionary of Betti numbers {h0: int, h1: int, ...}
        """
        betti = {}
        for dim, dgm in enumerate(diagrams):
            # Filter out short-lived features (noise)
            # Lifetime = death - birth
            lifetimes = dgm[:, 1] - dgm[:, 0]
            
            # Handle infinite death (H0 usually has one inf feature)
            # We treat inf as maximum finite lifetime or just count it separately
            finite_lifetimes = lifetimes[np.isfinite(lifetimes)]
            
            current_threshold = threshold
            
            if adaptive and len(finite_lifetimes) > 0:
                mean_life = np.mean(finite_lifetimes)
                std_life = np.std(finite_lifetimes)
                current_threshold = mean_life + (sigma * std_life)
                logger.debug(f"H{dim} Adaptive Threshold: {current_threshold:.4f} (Mean: {mean_life:.4f}, Std: {std_life:.4f})")
            
            # Count significant features
            # For H0, we always include the infinite component + any finite components > threshold
            if dim == 0:
                # Count infinite features (usually 1)
                inf_count = np.sum(np.isinf(lifetimes))
                # Count finite features > threshold
                sig_finite = np.sum(finite_lifetimes > current_threshold)
                betti[f"h{dim}"] = int(inf_count + sig_finite)
            else:
                significant = np.sum(lifetimes > current_threshold)
                betti[f"h{dim}"] = int(significant)
            
        return betti
