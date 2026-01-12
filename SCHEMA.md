# Project Schema - TopoForge Frontend

This document provides a technical overview of the TopoForge Frontend architecture and component hierarchy.

## Architecture Diagram

```mermaid
graph TD
    subgraph "Entry Point"
        A[main.tsx] --> B[App.tsx]
    end

    subgraph "Core Wrappers"
        B --> C[ThemeProvider]
        C --> D[Layout]
    end

    subgraph "Pages / Routing"
        D --> E[DashboardPage]
        D --> F[NetworkPage]
        D --> G[PersistencePage]
        D --> H[ProfilePage]
        D --> I[SettingsPage]
    end

    subgraph "Components"
        F --> F1[NetworkGraph3D]
        F --> F2[NetworkControls]
        G --> G1[PersistenceDiagram]
        G --> G2[PersistenceBarcode]
        E --> E1[LiveDashboard]
    end

    subgraph "State & Utils"
        State[Zustand Stores] -.-> Components[Components]
        Hooks[Custom Hooks] -.-> Components
        Utils[Utility Functions] -.-> Components
    end
```

## Module Definitions

### 1. Visualizations (`src/components/visualizations`)
- **NetworkGraph3D**: Uses Three.js for 3D topological network rendering.
- **PersistenceDiagram/Barcode**: D3/Recharts based topological data visualization.

### 2. State Management (`src/hooks` & `src/contexts`)
- Uses **Zustand** for lightweight global state management (filtering, data selection).
- **React Context** for theme and low-frequency global settings.

### 3. Layout and Navigation (`src/components/layout`)
- Sidebar-based navigation with responsive collapse.
- Global header with search and user status.

## Data Flow
1. **Fetch/Mock**: Data is retrieved from services or generated in `utils`.
2. **Global Store**: Data is stored in Zustand stores for cross-component access.
3. **Reactive Props**: Components subscribe to store changes to update visualizations in real-time.
