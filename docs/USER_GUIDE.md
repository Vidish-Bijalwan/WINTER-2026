# TopoForge User Guide

## Dashboard Overview
The Live Intelligence Dashboard provides real-time visibility into data streams using Topological Data Analysis (TDA).

### Widgets

#### Anomaly Score
Displays the unified anomaly score (0-100).
- **Green (<40)**: Normal behavior.
- **Yellow (40-70)**: Warning. Potential structural change.
- **Red (>70)**: Critical. Significant topological anomaly detected.
- **Breakdown**: Shows contributions from Structure (Betti numbers), Entropy (Chaos), and ML Model.

#### Persistence Landscape
Visualizes the "shape" of the data as a mountain range.
- **Peaks**: Represent significant, persistent loops (H1 features) in the data.
- **Flat**: Indicates noise or lack of structure.
- **Sudden Changes**: Large shifts in the landscape often precede anomalies.

#### Live Event Feed
Shows the raw stream of incoming data events (e.g., Wikipedia edits).

#### Anomaly Timeline
A historical view of detected anomalies. Click on a point to see details.

### Configuration

You can adjust the sensitivity of the system in **Settings**.
1. Go to the **Settings** page.
2. Adjust the **Anomaly Threshold** slider.
   - **Lower**: More sensitive (more alerts).
   - **Higher**: Less sensitive (fewer alerts).
3. Changes take effect immediately.

### Data Export

To analyze data offline:
1. Click the **Export Data** button in the Dashboard header.
2. A CSV file containing all anomaly logs, scores, and topological features will be downloaded.
