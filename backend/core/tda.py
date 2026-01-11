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

    def compute_total_lifetime(self, diagrams) -> float:
        """
        Compute the sum of lifetimes of all features in the diagrams.
        """
        total_lifetime = 0.0
        for dgm in diagrams:
            if len(dgm) == 0: continue
            # Filter out infinite death times (usually H0)
            finite_dgm = dgm[dgm[:, 1] != np.inf]
            if len(finite_dgm) > 0:
                lifetimes = finite_dgm[:, 1] - finite_dgm[:, 0]
                total_lifetime += np.sum(lifetimes)
        return float(total_lifetime)

    def compute_persistence_entropy(self, diagrams) -> float:
        """
        Compute the Shannon entropy of the persistence diagram.
        High entropy = many features of similar size (noise/chaos).
        Low entropy = few dominant features (structured).
        """
        total_lifetime = self.compute_total_lifetime(diagrams)
        if total_lifetime == 0:
            return 0.0
            
        entropy = 0.0
        for dgm in diagrams:
            if len(dgm) == 0: continue
            finite_dgm = dgm[dgm[:, 1] != np.inf]
            if len(finite_dgm) == 0: continue
            
            lifetimes = finite_dgm[:, 1] - finite_dgm[:, 0]
            probs = lifetimes / total_lifetime
            
            # Avoid log(0)
            probs = probs[probs > 0]
            entropy -= np.sum(probs * np.log(probs))
            
        return float(entropy)

    def compute_persistence_landscape(self, diagrams, resolution: int = 100) -> dict:
        """
        Compute the first layer of the persistence landscape for H1 features.
        Returns x and y coordinates for plotting.
        """
        # Focus on H1 (loops) for now as they are most interesting for anomalies
        if len(diagrams) < 2:
            return {"x": [], "y": []}
            
        dgm = diagrams[1] # H1
        if len(dgm) == 0:
            return {"x": [], "y": []}
            
        # Filter finite features
        finite_dgm = dgm[dgm[:, 1] != np.inf]
        if len(finite_dgm) == 0:
            return {"x": [], "y": []}
            
        # Define range for the landscape
        min_birth = np.min(finite_dgm[:, 0])
        max_death = np.max(finite_dgm[:, 1])
        padding = (max_death - min_birth) * 0.1
        t_vals = np.linspace(min_birth - padding, max_death + padding, resolution)
        landscape_vals = np.zeros(resolution)
        
        # Compute 1st Landscape Layer (max envelope of triangle functions)
        # For each point (b, d), f(t) = max(0, min(t-b, d-t))
        for i, t in enumerate(t_vals):
            vals = []
            for pt in finite_dgm:
                b, d = pt[0], pt[1]
                val = max(0, min(t - b, d - t))
                vals.append(val)
            
            if vals:
                landscape_vals[i] = max(vals) # 1st layer is the maximum
                
        return {
            "x": t_vals.tolist(),
            "y": landscape_vals.tolist()
        }
