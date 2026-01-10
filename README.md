# TopoForge Frontend

Advanced Topological Data Analysis Visualization Platform

## Features

### Phase 1: Enhanced Data Visualizations
- **3D Network Visualization**: Interactive 3D network graph with zoom, click, search, color customization, edge thickness, transitions, and mini-map
- **Persistence Diagrams**: Interactive scatter plots and barcode visualizations with filtering and synchronization

### Phase 2: User Dashboard & Settings
- **Real-time Dashboard**: Live anomaly feed, statistics panels, and data source monitoring
- **User Profile & Settings**: Comprehensive profile management and settings pages with theme support

### Phase 3: Mobile Responsiveness & PWA
- **Mobile-Responsive Design**: Fully responsive layout with mobile navigation
- **Progressive Web App**: PWA support with service worker, manifest, and offline capabilities

### Phase 4: Advanced Features
- **Advanced Filtering & Search**: Global search with debouncing and advanced filter options
- **Data Export & Reporting**: Export functionality for multiple formats (JSON, CSV, PNG) and report builder

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── charts/          # Exportable chart components
│   ├── dashboard/       # Dashboard components
│   ├── export/          # Export dialog and utilities
│   ├── filters/         # Advanced filter components
│   ├── layout/          # Layout and navigation
│   ├── pwa/             # PWA components
│   ├── reports/         # Report builder
│   ├── search/          # Global search
│   ├── settings/        # Settings components
│   └── visualizations/  # 3D and persistence visualizations
├── contexts/            # React contexts (Theme, Realtime)
├── hooks/               # Custom React hooks
├── pages/               # Page components
└── utils/               # Utility functions
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Three.js / React Three Fiber** - 3D visualizations
- **Recharts** - 2D charts
- **React Router** - Routing
- **Vite** - Build tool
- **PWA** - Progressive Web App support

## Development

The project uses Vite for fast development and building. The development server runs on `http://localhost:3000` by default.

## License

MIT
