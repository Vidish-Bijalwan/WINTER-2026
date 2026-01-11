# Team Member 2: Frontend Features & UI Development

## 👤 Your Role
You are responsible for **Frontend Features**, **UI Components**, and **Visualizations**. Your work will create stunning, interactive user interfaces that make TopoForge's anomaly detection capabilities accessible and visually impressive.

---

## 🎯 Your Objectives

### Phase 1: Enhanced Data Visualizations (Week 1-2)
- Create advanced 3D network visualizations
- Build interactive persistence diagrams
- Implement real-time chart updates

### Phase 2: User Dashboard & Settings (Week 3)
- Design user profile page
- Create settings panel with preferences
- Build alert configuration UI

### Phase 3: Mobile Responsiveness & PWA (Week 4)
- Make entire app mobile-responsive
- Add Progressive Web App capabilities
- Implement touch-friendly interactions

---

## 📋 Detailed Tasks

### Task 1: Advanced 3D Network Visualization
**What you'll do:**
Enhance the existing 3D force-directed graph with zoom, node filtering, and interactive tooltips

**Files to create/modify:**
- `src/components/visualizations/NetworkGraph3D.tsx` (enhance existing)
- `src/components/visualizations/NetworkControls.tsx` (new)
- `src/hooks/useNetworkInteraction.ts` (new)

**Antigravity Prompt:**
```
Enhance the 3D network visualization in TopoForge with advanced interactions:

1. Update src/components/visualizations/NetworkGraph3D.tsx:
   - Add zoom controls (zoom in, zoom out, reset view)
   - Implement node clicking to show detailed information panel
   - Add node search/filter functionality
   - Color nodes by anomaly severity (green=normal, yellow=warning, red=critical)
   - Add edge thickness based on connection strength
   - Implement smooth camera transitions when focusing on nodes
   - Add mini-map in bottom-right corner showing full graph overview
   - Use @react-three/fiber and @react-three/drei for helpers

2. Create src/components/visualizations/NetworkControls.tsx:
   - Control panel overlay on the 3D view
   - Buttons: Zoom In, Zoom Out, Reset View, Auto-Rotate
   - Sliders: Node Size, Edge Opacity, Animation Speed
   - Filters: Show/Hide by source type (Wikipedia, Twitter, etc.)
   - Search bar to highlight specific nodes
   - Export view as PNG button

3. Create src/hooks/useNetworkInteraction.ts:
   - Custom hook for managing camera position
   - Node selection state management
   - Search and filter logic
   - Export functionality using html2canvas

4. Add these dependencies to package.json:
   - @react-three/drei: "^9.96.0"
   - @react-three/postprocessing: "^2.16.0"
   - html2canvas: "^1.4.1"

Use TypeScript with proper typing. Include smooth animations using gsap or react-spring.
```

---

### Task 2: Interactive Persistence Diagrams
**What you'll do:**
Create interactive persistence barcode and diagram visualizations

**Files to create:**
- `src/components/visualizations/PersistenceDiagram.tsx`
- `src/components/visualizations/PersistenceBarcode.tsx`
- `src/utils/persistenceCalculations.ts`

**Antigravity Prompt:**
```
Create interactive persistence diagram visualizations for TopoForge TDA features:

1. Create src/components/visualizations/PersistenceDiagram.tsx:
   - Scatter plot showing birth-death points for H0, H1, H2
   - Different colors for each homology dimension (H0=blue, H1=green, H2=red)
   - Diagonal reference line (birth = death)
   - Hoverable points showing (birth, death, persistence) values
   - Zoomable and pan-able using D3.js zoom behavior
   - Legend explaining homology dimensions
   - Time slider to show evolution of persistence over time

2. Create src/components/visualizations/PersistenceBarcode.tsx:
   - Horizontal barcodes for each homology class
   - Bars colored by persistence length (longer = more important)
   - Grouped by dimension (H0, H1, H2)
   - Hoverable bars showing detailed information
   - Filterable by minimum persistence threshold
   - Export to SVG button

3. Create src/utils/persistenceCalculations.ts:
   - calculatePersistence(birthDeathPairs) - Compute persistence values
   - filterByThreshold(pairs, minPersistence) - Filter significant features
   - sortByPersistence(pairs) - Sort features by importance
   - getBettiNumbers(pairs, threshold) - Compute Betti numbers at threshold

4. Add interactivity:
   - Clicking a point/bar highlights corresponding component in 3D graph
   - Synchronized brushing between diagram and barcode
   - Animation when new data arrives

Use D3.js for rendering, React for state management. Include TypeScript types for all data structures.
```

---

### Task 3: Real-time Dashboard with Live Updates
**What you'll do:**
Create a comprehensive dashboard that updates in real-time as anomalies are detected

**Files to create:**
- `src/components/dashboard/DashboardLayout.tsx`
- `src/components/dashboard/AnomalyFeed.tsx`
- `src/components/dashboard/StatisticsPanel.tsx`
- `src/components/dashboard/SourceMonitor.tsx`

**Antigravity Prompt:**
```
Build a real-time anomaly detection dashboard for TopoForge:

1. Create src/components/dashboard/DashboardLayout.tsx:
   - Grid layout with 4 sections:
     * Top-left: Real-time anomaly feed
     * Top-right: Statistics panel
     * Bottom-left: Source monitor
     * Bottom-right: Recent alerts
   - Responsive design (2x2 on desktop, single column on mobile)
   - Drag-and-drop to rearrange panels (use react-grid-layout)
   - Save layout preferences to localStorage

2. Create src/components/dashboard/AnomalyFeed.tsx:
   - Live scrolling feed of detected anomalies
   - Each item shows: timestamp, source, severity, Betti numbers
   - Color-coded by severity (info/warning/critical)
   - Click to expand with full details
   - Auto-scroll when new items arrive (with pause button)
   - "Load More" button for historical data
   - Filter by source and severity
   - Maximum 100 items in memory (virtualized list using react-window)

3. Create src/components/dashboard/StatisticsPanel.tsx:
   - Cards showing:
     * Total anomalies detected (last 24h)
     * Average anomaly score
     * Most active data source
     * Detection rate (anomalies per hour)
   - Line chart showing anomaly trend over time (using Recharts)
   - Sparklines for each Betti number (H0, H1, H2)
   - Auto-refresh every 30 seconds

4. Create src/components/dashboard/SourceMonitor.tsx:
   - Status indicator for each data source (Wikipedia, Twitter, GitHub)
   - Shows: Active/Inactive, Events processed, Last event timestamp
   - Pie chart of events by source
   - Connection health indicator (latency, error rate)

5. Add real-time data fetching:
   - Use WebSocket connection to backend
   - React Context for sharing real-time data across components
   - Automatic reconnection on disconnect
   - Optional: Server-Sent Events (SSE) fallback

Dependencies to add:
- react-grid-layout: "^1.4.4"
- react-window: "^1.8.10"
- date-fns: "^3.0.6"

Use Tailwind CSS for styling, Shadcn/UI components for consistency.
```

---

### Task 4: User Profile & Settings Page
**What you'll do:**
Create user profile management and application settings

**Files to create:**
- `src/pages/ProfilePage.tsx`
- `src/pages/SettingsPage.tsx`
- `src/components/settings/NotificationSettings.tsx`
- `src/components/settings/DisplaySettings.tsx`

**Antigravity Prompt:**
```
Create user profile and settings pages for TopoForge:

1. Create src/pages/ProfilePage.tsx:
   - User information display:
     * Avatar (upload with preview)
     * Username (editable)
     * Email (editable)
     * Role (viewer/admin - display only)
     * Account created date
   - Form with validation using react-hook-form
   - "Save Changes" button (calls PUT /api/users/{id})
   - Password change section (old password, new password, confirm)
   - Activity log showing recent actions

2. Create src/pages/SettingsPage.tsx:
   - Tabbed interface:
     * Notifications
     * Display Preferences
     * Data Sources
     * Advanced
   - Use Shadcn/UI Tabs component
   - Each tab is a separate component
   - Save button in footer (persists to backend)

3. Create src/components/settings/NotificationSettings.tsx:
   - Toggle switches for:
     * Email notifications on anomaly detection
     * Desktop notifications (using Notification API)
     * Anomaly severity threshold for alerts (slider)
     * Quiet hours (time range picker)
   - Test notification button
   - Email frequency selector (real-time, hourly, daily digest)

4. Create src/components/settings/DisplaySettings.tsx:
   - Theme selector (Light, Dark, Auto)
   - Color scheme picker for graphs
   - Date/Time format selector
   - Timezone selector (using Intl API)
   - Chart animation toggle
   - Density selector (compact, comfortable, spacious)

5. Create src/components/settings/DataSourceSettings.tsx:
   - Enable/disable individual data sources
   - Configure sampling rate for each source
   - API key management (for Twitter, GitHub)
   - Connection test button

6. Add theme switching:
   - Create src/contexts/ThemeContext.tsx
   - Implement dark mode with Tailwind dark: variants
   - Persist preference to localStorage
   - Smooth transition animations

Dependencies:
- react-hook-form: "^7.49.3"
- @hookform/resolvers: "^3.3.4"
- zod: "^3.22.4" (for validation schemas)

Use Shadcn/UI components: Form, Input, Button, Tabs, Switch, Slider, Select.
```

---

### Task 5: Mobile-Responsive Design
**What you'll do:**
Ensure the entire application works flawlessly on mobile devices

**Files to modify:**
- `src/index.css` (responsive utilities)
- All major components
- `src/components/layout/MobileNav.tsx` (new)

**Antigravity Prompt:**
```
Make TopoForge fully responsive for mobile and tablet devices:

1. Update src/index.css:
   - Add mobile-first responsive breakpoints
   - Base font size: 16px (prevents zoom on iOS inputs)
   - Touch-friendly tap targets (minimum 44x44px)
   - Mobile-specific utilities:
     * .touch-action-pan for scroll areas
     * .tap-highlight-none for buttons
     * Safe area insets for notched devices (iOS)

2. Create src/components/layout/MobileNav.tsx:
   - Bottom navigation bar for mobile (< 768px)
   - Icons with labels: Dashboard, Sources, Alerts, Profile
   - Highlight active tab
   - Slide-in drawer for settings (hamburger menu)
   - Hide on desktop, show sticky bottom nav on mobile

3. Update all dashboard components:
   - src/components/dashboard/DashboardLayout.tsx:
     * Stack panels vertically on mobile
     * Swipeable panels (use react-swipeable)
     * Full-width cards with proper padding
   
   - src/components/visualizations/NetworkGraph3D.tsx:
     * Touch controls for rotation and zoom
     * Simplified controls for mobile (fewer buttons)
     * Render performance optimization for mobile GPUs
   
   - src/components/dashboard/AnomalyFeed.tsx:
     * Card-based layout instead of table on mobile
     * Pull-to-refresh functionality
     * Infinite scroll

4. Update src/pages/ProfilePage.tsx and SettingsPage.tsx:
   - Full-width forms on mobile
   - Larger input fields for touch
   - Bottom sheet for pickers (date, time, timezone)

5. Add responsive utilities:
   - Create src/hooks/useMediaQuery.ts for breakpoint detection
   - Create src/hooks/useTouchDevice.ts to detect touch capability
   - Add viewport meta tag in index.html (if missing)

6. Testing checklist to add in comments:
   - [ ] All text is readable without zooming
   - [ ] No horizontal scrolling
   - [ ] Touch targets are 44x44px minimum
   - [ ] Forms work with mobile keyboards
   - [ ] Drawers and modals don't cause body scroll

Dependencies:
- react-swipeable: "^7.0.1"

Use Tailwind responsive prefixes: sm:, md:, lg:, xl:. Test on mobile viewports: 375px, 414px, 768px.
```

---

### Task 6: Progressive Web App (PWA) Setup
**What you'll do:**
convert TopoForge into an installable Progressive Web App

**Files to create:**
- `public/manifest.json`
- `public/sw.js` (Service Worker)
- `src/hooks/useServiceWorker.ts`

**Antigravity Prompt:**
```
Convert TopoForge into a Progressive Web App:

1. Create public/manifest.json:
   {
     "name": "TopoForge - Anomaly Detection Platform",
     "short_name": "TopoForge",
     "description": "Real-time anomaly detection using TDA",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#0f172a",
     "theme_color": "#3b82f6",
     "orientation": "portrait-primary",
     "icons": [
       { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
       { "src": "/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
     ],
     "categories": ["productivity", "business", "analytics"]
   }

2. Create public/sw.js (Service Worker):
   - Cache strategy: Network First for API calls, Cache First for static assets
   - Cache name versioning for updates
   - Background sync for offline anomaly submissions
   - Push notification support
   - Skip waiting and claim clients on activation

3. Update index.html:
   - Add manifest link: <link rel="manifest" href="/manifest.json">
   - Add theme-color meta tag
   - Add apple-touch-icon links for iOS
   - Add apple-mobile-web-app-capable meta tag

4. Create src/hooks/useServiceWorker.ts:
   - Register service worker on page load
   - Handle updates (show "New version available" toast)
   - Provide skipWaiting() function to update immediately
   - Return registration status (installing, active, waiting)

5. Create src/components/PWAPrompt.tsx:
   - Detect if app is installable (beforeinstallprompt event)
   - Show "Install App" banner with dismiss option
   - Track installation in localStorage (don't show again if dismissed)
   - A2HS (Add to Home Screen) instructions for iOS

6. Add offline functionality:
   - Create src/pages/OfflinePage.tsx (shown when offline)
   - Queue anomaly submissions when offline
   - Sync when back online using Background Sync API

7. Generate icons:
   - Create icon sizes: 192x192, 512x512, and maskable version
   - Use proper safe zone for maskable icons
   - Save in public/ directory

Dependencies:
- workbox-webpack-plugin: "^7.0.0" (if using webpack)
- Or use Vite PWA plugin: vite-plugin-pwa: "^0.17.5"

Add installation prompt to main navigation. Include instructions in README for testing PWA locally.
```

---

### Task 7: Advanced Filtering & Search
**What you'll do:**
Add powerful filtering and search capabilities across the app

**Files to create:**
- `src/components/search/GlobalSearch.tsx`
- `src/components/filters/AdvancedFilters.tsx`
- `src/hooks/useDebounce.ts`

**Antigravity Prompt:**
```
Implement advanced search and filtering for TopoForge:

1. Create src/components/search/GlobalSearch.tsx:
   - Keyboard shortcut to open (Cmd/Ctrl + K)
   - Command palette style interface (like VSCode)
   - Search across:
     * Anomaly logs (by ID, source, timestamp range)
     * Settings
     * Navigation (quick jump to pages)
   - Real-time search results as you type (debounced)
   - Keyboard navigation (up/down arrows, Enter to select)
   - Recent searches history
   - Use Shadcn/UI Command component

2. Create src/components/filters/AdvancedFilters.tsx:
   - Multi-select for data sources
   - Date range picker (start date, end date)
   - Severity slider (info, warning, critical)
   - Betti number range filters (H0, H1, H2)
   - Anomaly score range
   - "Save Filter" to create preset
   - "Clear All" button
   - URL query param synchronization (filters persist on reload)

3. Create src/hooks/useDebounce.ts:
   - Generic debounce hook for search input
   - Configurable delay (default 300ms)
   - Cancel on unmount

4. Create src/hooks/useQueryParams.ts:
   - Sync filter state with URL query parameters
   - Parse URL params on mount
   - Update URL as filters change (without page reload)
   - Browser back/forward support

5. Update src/components/dashboard/AnomalyFeed.tsx:
   - Integrate AdvancedFilters component
   - Apply filters to API requests
   - Show active filter badges
   - "X results found" counter

6. Add search API endpoint integration:
   - Call GET /api/anomalies with query parameters
   - Handle pagination with filters
   - Loading states and error handling

Dependencies:
- cmdk: "^1.0.0" (for command palette)
- query-string: "^8.2.0" (for URL param handling)

Use Fuzzy search for text matching. Add keyboard shortcuts info in a help modal (? key to open).
```

---

### Task 8: Data Export & Reporting
**What you'll do:**
Allow users to export data and generate reports

**Files to create:**
- `src/components/export/ExportDialog.tsx`
- `src/utils/exportFormats.ts`
- `src/components/reports/ReportBuilder.tsx`

**Antigravity Prompt:**
```
Create data export and report generation features for TopoForge:

1. Create src/components/export/ExportDialog.tsx:
   - Modal dialog with export options:
     * Format: CSV, JSON, PDF
     * Date range selector
     * Include filters toggle
     * Fields to export (checkboxes for each field)
   - Preview pane showing first 10 rows
   - "Download" button triggering export
   - Progress indicator for large exports

2. Create src/utils/exportFormats.ts:
   - exportToCSV(data, filename) - Convert array to CSV and download
   - exportToJSON(data, filename) - Pretty-printed JSON download
   - exportToPDF(data, filename) - Generate PDF report using jsPDF
   - Functions should:
     * Format timestamps to readable dates
     * Round numbers to 2 decimals
     * Handle special characters (commas in CSV)

3. Create src/components/reports/ReportBuilder.tsx:
   - Drag-and-drop report builder:
     * Available widgets: Chart, Table, Statistics, Text
     * Canvas area to drop widgets
     * Configure each widget (data source, time range)
   - Report templates:
     * Daily Summary
     * Weekly Analysis
     * Source Comparison
     * Anomaly Deep Dive
   - Save custom reports
   - Schedule reports (future enhancement placeholder)
   - Email report button (calls backend API)

4. Create src/components/charts/ExportableChart.tsx:
   - Wrapper for Recharts components
   - Add "Download as PNG" button to any chart
   - Use html2canvas to capture chart
   - Clean filename with timestamp

5. Add to src/components/dashboard/AnomalyFeed.tsx:
   - "Export" button in header
   - Opens ExportDialog with current filters pre-applied

Dependencies:
- jspdf: "^2.5.1"
- jspdf-autotable: "^3.8.2" (for PDF tables)
- html2canvas: "^1.4.1"
- file-saver: "^2.0.5"

Include export limits (max 10,000 rows for CSV, 1,000 for PDF) to prevent browser crashes.
```

---

## 🔁 Git Workflow (Step-by-Step)

### First Time Setup

1. **Install Git** (if not already installed):
   ```bash
   git --version
   # If not installed, download from git-scm.com
   ```

2. **Configure Git**:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Clone the Repository**:
   ```bash
   git clone https://github.com/Vidish-Bijalwan/WINTER-2026.git
   cd WINTER-2026
   ```

---

### For Each Task

**Step 1: Create a Feature Branch**
```bash
# Start from main branch
git checkout main
git pull origin main

# Create your feature branch
git checkout -b frontend/3d-network-enhancements

# Branch naming examples:
# frontend/persistence-diagrams
# frontend/mobile-responsive
# frontend/pwa-setup
# frontend/user-settings
```

**Step 2: Make Changes with Antigravity**
- Open Antigravity IDE in the project directory
- Copy-paste the Antigravity prompt from your task
- Review generated code carefully
- Test in browser

**Step 3: Test Your Changes**
```bash
# Install new dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:5173

# Test on different screen sizes (use browser DevTools)
# Test all interactive features
```

**Step 4: Commit Your Changes**
```bash
# See what changed
git status

# Add files
git add src/components/visualizations/
git add src/hooks/
git add package.json package-lock.json

# Commit with descriptive message
git commit -m "feat: Add advanced 3D network visualization controls

- Implemented zoom controls and camera transitions
- Added node search and filtering functionality
- Created NetworkControls component with settings panel
- Added color-coding by anomaly severity
- Implemented mini-map overview
- Added export to PNG functionality"
```

**Step 5: Push Your Branch**
```bash
git push origin frontend/3d-network-enhancements
```

**Step 6: Create Pull Request**
1. Visit https://github.com/Vidish-Bijalwan/WINTER-2026
2. Click "Compare & pull request"
3. Fill in details:
   ```
   ## What does this PR do?
   Enhances 3D network visualization with interactive controls
   
   ## Changes
   - Added zoom, pan, and rotate controls
   - Implemented node search and filtering
   - Created settings panel for customization
   - Added screenshot export feature
   
   ## Screenshots
   [Attach before/after screenshots]
   
   ## Testing
   - Tested on Chrome, Firefox, Safari
   - Verified responsive design on mobile
   - All interactions working smoothly
   ```
4. Request review from team lead

---

## 📝 Checklist Before PR

- [ ] Code runs without errors in browser console
- [ ] All new components have proper TypeScript types
- [ ] UI is responsive (test 375px, 768px, 1920px widths)
- [ ] Dark mode works correctly
- [ ] All interactive elements have hover/focus states
- [ ] No console warnings
- [ ] Performance is acceptable (check React DevTools Profiler)
- [ ] Accessibility: keyboard navigation works, proper ARIA labels
- [ ] Screenshots attached to PR for UI changes
- [ ] Branch name follows convention: `frontend/<feature-name>`

---

## 🎨 Design Guidelines

### Colors (use Tailwind classes)
- **Primary**: `bg-blue-600`, `text-blue-600`
- **Success**: `bg-green-500`, `text-green-500`
- **Warning**: `bg-yellow-500`, `text-yellow-500`
- **Critical**: `bg-red-600`, `text-red-600`
- **Background (dark)**: `bg-slate-900`
- **Background (light)**: `bg-white`

### Component Library
Always use Shadcn/UI components:
- Button: `@/components/ui/button`
- Input: `@/components/ui/input`
- Card: `@/components/ui/card`
- Dialog: `@/components/ui/dialog`
- Tabs: `@/components/ui/tabs`

### Spacing
- Mobile: `p-4`, `gap-4`
- Desktop: `p-6`, `gap-6`
- Containers: `max-w-7xl mx-auto`

### Typography
- Headings: `font-bold text-2xl lg:text-3xl`
- Body: `text-base text-slate-700 dark:text-slate-300`
- Small: `text-sm text-slate-500`

---

## 🎓 Learning Resources

### React & TypeScript
- **React Docs**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

### Tailwind CSS
- **Docs**: https://tailwindcss.com/docs
- **Shadcn/UI**: https://ui.shadcn.com/

### Three.js
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **Examples**: https://threejs.org/examples/

### D3.js
- **Gallery**: https://observablehq.com/@d3/gallery
- **React + D3**: https://2019.wattenberger.com/blog/react-and-d3

---

## 🆘 Common Issues & Solutions

### Issue 1: "Module not found" after adding dependency
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Three.js scene is black/not rendering
**Solution:**
- Check camera position (should not be at 0,0,0)
- Add lights to the scene: `<ambientLight intensity={0.5} />`
- Verify canvas has width/height

### Issue 3: Tailwind classes not working
**Solution:**
- Ensure file is in `content` array in `tailwind.config.ts`
- Restart dev server after config changes
- Check for typos in class names

### Issue 4: Component re-renders too much
**Solution:**
```tsx
// Memoize expensive components
import { memo } from 'react';
export const MyComponent = memo(({ data }) => {
  // ... component code
});

// Memoize callbacks
import { useCallback } from 'react';
const handleClick = useCallback(() => {}, [deps]);
```

---

## 📊 Performance Checklist

- [ ] Images are optimized (WebP format, lazy loading)
- [ ] Large lists use virtualization (react-window)
- [ ] Heavy components are code-split (React.lazy)
- [ ] Debounce search inputs (300ms delay)
- [ ] Memoize expensive calculations (useMemo)
- [ ] Avoid inline function props (useCallback)
- [ ] 3D scenes run at 60fps (check with DevTools)

---

## ✅ Final Deliverables Checklist

By the end of your work, you should have:

- [ ] Enhanced 3D network visualization with controls
- [ ] Interactive persistence diagrams and barcodes
- [ ] Real-time dashboard with live updates
- [ ] User profile and settings pages
- [ ] Fully responsive mobile design
- [ ] PWA capabilities (installable app)
- [ ] Advanced search and filtering system
- [ ] Data export in multiple formats
- [ ] At least 25+ commits with your name
- [ ] 6-10 merged pull requests
- [ ] All UI uses Shadcn/UI components
- [ ] Dark mode fully functional
- [ ] Screenshots in docs/ folder
- [ ] Mobile tested on real devices

---

## 🕒 Estimated Timeline

| Week | Tasks | Deliverables |
|------|-------|--------------|
| **Week 1** | Tasks 1-2 | 3D visualization, persistence diagrams |
| **Week 2** | Tasks 3-4 | Dashboard, profile/settings |
| **Week 3** | Tasks 5-6 | Mobile responsive, PWA |
| **Week 4** | Tasks 7-8 | Search/filters, export features |

---

**Good luck! Make it beautiful! 🎨**

Remember: Users will judge the entire platform by your UI. Make every pixel count. Smooth animations, thoughtful interactions, and delightful experiences separate good apps from great ones.
