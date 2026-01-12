# TopoShape Insights - Data Flow Diagrams (DFDs)

## System Overview
TopoShape Insights is a real-time anomaly detection platform using Topological Data Analysis (TDA).

---

## Level 0 DFD - Context Diagram

```mermaid
graph TD
    User[User/Analyst] -->|Views Dashboard| System[TopoShape Insights Platform]
    System -->|Displays Anomalies & Metrics| User
    
    WikiSSE[Wikipedia SSE Stream] -->|Real-time Events| System
    System -->|Requests Event Data| WikiSSE
    
    MongoDB[(MongoDB Atlas)] <-->|Stores/Retrieves User Data| System
    
    System -->|Sends Analysis Requests| Backend[TopoForge Backend]
    Backend -->|Returns TDA Results| System
```

**External Entities:**
- **User/Analyst**: Accesses dashboard, views anomaly alerts
- **Wikipedia SSE**: Provides real-time edit stream
- **MongoDB Atlas**: Persistent storage for authentication & settings
- **TopoForge Backend**: AI-powered TDA processing service

---

## Level 1 DFD - High-Level Data Flow

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[User Interface<br/>React Dashboard]
        Auth[Authentication<br/>Module]
        Viz[Visualization<br/>Components]
    end
    
    subgraph "Data Processing Layer"
        StreamProc[Stream Processor<br/>Wikipedia SSE Client]
        TDAEngine[TDA Engine<br/>Web Worker]
        AnomalyDet[Anomaly Detector<br/>Multi-Modal]
    end
    
    subgraph "Storage Layer"
        EventBuffer[Event Ring Buffer<br/>Max 2000 events]
        PersistStore[(Persistence<br/>Diagrams Cache)]
    end
    
    subgraph "Backend Services"
        API[REST API<br/>FastAPI]
        ML[ML Service<br/>TDA Analysis]
        DB[(MongoDB<br/>User Data)]
    end
    
    %% Data Flows
    UI -->|User Actions| Auth
    Auth -->|JWT Token| API
    API <-->|CRUD Operations| DB
    
    WikiSSE[Wikipedia SSE] -->|Event Stream| StreamProc
    StreamProc -->|Parsed Events| EventBuffer
    EventBuffer -->|Event Batch| TDAEngine
    
    TDAEngine -->|Persistence Diagram| AnomalyDet
    TDAEngine -->|Cached Diagrams| PersistStore
    PersistStore -->|Baseline Data| AnomalyDet
    
    AnomalyDet -->|Anomaly Scores| Viz
    EventBuffer -->|Live Events| Viz
    Viz -->|Render| UI
    
    EventBuffer -->|Event Data| API
    API -->|Analysis Request| ML
    ML -->|Betti Numbers & Scores| API
    API -->|Results| UI
```

**Processes:**
1. **Stream Processor**: Connects to Wikipedia SSE, parses events
2. **TDA Engine**: Computes persistence diagrams in Web Worker
3. **Anomaly Detector**: Multi-modal scoring (Wasserstein + Landscapes + Stats)
4. **Visualization**: Renders charts (Barcode, Birth-Death, Filtration)
5. **API Layer**: Authentication, user management, ML integration

---

## Level 2 DFD - TDA Processing Pipeline

```mermaid
graph TB
    subgraph "Input Stage"
        Events[Wikipedia Events<br/>JSON Stream]
        Parser[Event Parser]
    end
    
    subgraph "Filtration Stage"
        Graph[Graph Builder<br/>Adjacency Matrix]
        Filtration[Vietoris-Rips<br/>Filtration]
    end
    
    subgraph "Homology Computation"
        Simplicial[Simplicial Complex<br/>Builder]
        Betti[Betti Number<br/>Calculator]
        Persistence[Persistence Diagram<br/>Generator]
    end
    
    subgraph "Feature Extraction"
        Wasserstein[Wasserstein Distance<br/>Computation]
        Landscapes[Persistence<br/>Landscapes]
        Statistical[Statistical<br/>Features]
    end
    
    subgraph "Anomaly Detection"
        Baseline[(Baseline<br/>Models)]
        Detector[Multi-Modal<br/>Detector]
        Scorer[Confidence<br/>Scorer]
    end
    
    subgraph "Output Stage"
        Alert[Anomaly Alert<br/>Generator]
        Viz[Visualization<br/>Pipeline]
    end
    
    %% Flow
    Events --> Parser
    Parser --> Graph
    Graph --> Filtration
    Filtration --> Simplicial
    Simplicial --> Betti
    Simplicial --> Persistence
    
    Persistence --> Wasserstein
    Persistence --> Landscapes
    Parser --> Statistical
    
    Wasserstein --> Detector
    Landscapes --> Detector
    Statistical --> Detector
    Baseline --> Detector
    
    Detector --> Scorer
    Scorer --> Alert
    Scorer --> Viz
    Persistence --> Viz
```

**Key Data Stores:**
- **Event Ring Buffer**: FIFO queue, max 2000 events
- **Baseline Models**: Last 50 persistence diagrams for normal traffic
- **Persistence Cache**: Temporary storage for diagram history

**Data Transformations:**
1. Raw JSON → Structured WikipediaEvent
2. Events → Graph (user-page-edit network)
3. Graph → Simplicial Complex (filtration)
4. Complex → Persistence Diagram (birth-death pairs)
5. Diagram → Feature Vector (Wasserstein, Landscapes)
6. Features → Anomaly Score (0-10 scale)

---

## Data Dictionary

| Data Element | Type | Source | Destination | Description |
|-------------|------|--------|-------------|-------------|
| WikipediaEvent | Object | SSE Stream | Event Buffer | Raw edit event with metadata |
| PersistenceDiagram | Array<Point> | TDA Engine | Detector | Set of (birth, death, dimension) tuples |
| AnomalyScore | Object | Detector | UI | {totalScore, confidence, components, isAnomaly} |
| BettiNumbers | Object | Homology | Backend | {h0, h1, h2} - connected components, loops, voids |
| WassersteinDistance | Number | Feature Extractor | Detector | L1-metric between diagrams |
| LandscapeNorm | Number | Feature Extractor | Detector | L2-norm of persistence landscape |

---

## Level 2 DFD - Authentication Flow

```mermaid
graph TB
    subgraph "Client Layer"
        LoginForm[Login Form<br/>React Component]
        AuthContext[Auth Context<br/>React Context]
        LocalStorage[Browser<br/>LocalStorage]
    end
    
    subgraph "API Gateway"
        AuthMiddleware[Auth Middleware<br/>JWT Validator]
        RateLimiter[Rate Limiter<br/>5 req/min]
    end
    
    subgraph "Backend Services"
        AuthRoute[Auth Route<br/>/api/auth/login]
        JWTHandler[JWT Handler<br/>Token Generator]
        PasswordUtils[Password Utils<br/>Bcrypt Verify]
    end
    
    subgraph "Database"
        UsersDB[(Users Collection)]
        SessionsDB[(Sessions Collection)]
    end
    
    %% Login Flow
    LoginForm -->|Credentials| RateLimiter
    RateLimiter -->|Rate OK| AuthRoute
    AuthRoute -->|Hash Check| PasswordUtils
    PasswordUtils -->|Query User| UsersDB
    UsersDB -->|User Data| PasswordUtils
    PasswordUtils -->|Verified| JWTHandler
    JWTHandler -->|Create Session| SessionsDB
    JWTHandler -->|Access Token| AuthRoute
    AuthRoute -->|JWT + User Info| AuthContext
    AuthContext -->|Store Token| LocalStorage
    
    %% Protected Route Flow
    AuthContext -->|JWT in Header| AuthMiddleware
    AuthMiddleware -->|Validate| JWTHandler
    JWTHandler -->|Verify Signature| AuthMiddleware
    AuthMiddleware -->|Authorized| ProtectedAPI[Protected API Routes]
```

**Authentication Process Details:**
1. **Login Request**: User submits credentials via React form
2. **Rate Limiting**: Middleware checks request rate (5 attempts/min)
3. **Password Verification**: Bcrypt compares hashed passwords
4. **JWT Generation**: Creates access token (24h expiry) and refresh token (7d expiry)
5. **Session Storage**: Stores session in MongoDB with TTL index
6. **Token Storage**: Client stores JWT in localStorage
7. **Authorization**: Middleware validates JWT on protected routes

---

## Level 2 DFD - Real-time Data Streaming Flow

```mermaid
graph TB
    subgraph "External Data Sources"
        WikiSSE[Wikipedia<br/>EventStreams SSE]
        TwitterAPI[Twitter/X API<br/>Mock Data]
    end
    
    subgraph "Frontend Stream Processing"
        SSEClient[SSE Client<br/>EventSource]
        StreamParser[Stream Parser<br/>JSON Decoder]
        EventValidator[Event Validator<br/>Schema Check]
    end
    
    subgraph "Data Processing Pipeline"
        RingBuffer[Ring Buffer<br/>Max 2000 Events]
        WindowManager[Sliding Window<br/>2-second batches]
        TDAWorker[Web Worker<br/>TDA Computation]
    end
    
    subgraph "Feature Extraction"
        GraphBuilder[Graph Builder<br/>Adjacency Matrix]
        Filtration[Vietoris-Rips<br/>Filtration]
        PersistenceCalc[Persistence<br/>Calculator]
    end
    
    subgraph "Anomaly Detection"
        BaselineCache[(Baseline Models<br/>Last 50 Windows)]
        WassersteinCalc[Wasserstein<br/>Distance]
        LandscapeCalc[Persistence<br/>Landscape]
        AnomalyScorer[Multi-Modal<br/>Scorer]
    end
    
    subgraph "UI Update"
        StateManager[React State<br/>Context API]
        VisualizationLayer[Visualization<br/>Components]
        AlertSystem[Alert System<br/>Toast Notifications]
    end
    
    %% Data Flow
    WikiSSE -->|SSE Stream| SSEClient
    SSEClient -->|Raw Events| StreamParser
    StreamParser -->|Parsed JSON| EventValidator
    EventValidator -->|Valid Events| RingBuffer
    
    RingBuffer -->|Event Batch| WindowManager
    WindowManager -->|Window Data| TDAWorker
    
    TDAWorker -->|Event Array| GraphBuilder
    GraphBuilder -->|Graph Matrix| Filtration
    Filtration -->|Simplicial Complex| PersistenceCalc
    
    PersistenceCalc -->|Persistence Diagram| WassersteinCalc
    PersistenceCalc -->|Persistence Diagram| LandscapeCalc
    PersistenceCalc -->|Store| BaselineCache
    BaselineCache -->|Historical Data| WassersteinCalc
    BaselineCache -->|Historical Data| LandscapeCalc
    
    WassersteinCalc -->|Distance Score| AnomalyScorer
    LandscapeCalc -->|Landscape Norm| AnomalyScorer
    AnomalyScorer -->|Anomaly Result| StateManager
    
    StateManager -->|Update Charts| VisualizationLayer
    StateManager -->|Trigger Alerts| AlertSystem
    PersistenceCalc -->|Diagram Data| VisualizationLayer
```

**Real-time Processing Metrics:**
- **Stream Rate**: 5-10 events/second (Wikipedia)
- **Buffer Capacity**: 2000 events (FIFO)
- **Processing Window**: 2 seconds (1000ms batches)
- **TDA Computation**: ~200ms for 2000 events
- **Anomaly Detection**: ~50ms per window
- **UI Update Frequency**: 2 seconds

---

## Level 2 DFD - API Request/Response Flow

```mermaid
graph TB
    subgraph "Client Application"
        ReactApp[React Application]
        APIClient[Fetch/Axios Client]
        ErrorHandler[Error<br/>Handler]
    end
    
    subgraph "Backend API Layer"
        CORSMiddleware[CORS<br/>Middleware]
        AuthMW[Auth<br/>Middleware]
        RateLimitMW[Rate Limit<br/>Middleware]
        Router[FastAPI<br/>Router]
    end
    
    subgraph "Business Logic"
        UserRoute[User Routes<br/>/api/users]
        AnomalyRoute[Anomaly Routes<br/>/api/anomalies]
        SourceRoute[Source Routes<br/>/api/sources]
    end
    
    subgraph "Data Access Layer"
        UserModel[User Model<br/>CRUD Operations]
        AnomalyModel[Anomaly Model<br/>CRUD Operations]
        SourceModel[Source Model<br/>CRUD Operations]
    end
    
    subgraph "Database"
        MongoDB[(MongoDB Atlas<br/>Database)]
    end
    
    subgraph "Response Pipeline"
        Serializer[Pydantic<br/>Serializer]
        ResponseBuilder[JSON Response<br/>Builder]
    end
    
    %% Request Flow
    ReactApp -->|HTTP Request| APIClient
    APIClient -->|AJAX Call| CORSMiddleware
    CORSMiddleware -->|CORS OK| AuthMW
    AuthMW -->|JWT Valid| RateLimitMW
    RateLimitMW -->|Rate OK| Router
    
    Router -->|Route Match| UserRoute
    Router -->|Route Match| AnomalyRoute
    Router -->|Route Match| SourceRoute
    
    UserRoute -->|Query| UserModel
    AnomalyRoute -->|Query| AnomalyModel
    SourceRoute -->|Query| SourceModel
    
    UserModel -->|CRUD| MongoDB
    AnomalyModel -->|CRUD| MongoDB
    SourceModel -->|CRUD| MongoDB
    
    %% Response Flow
    MongoDB -->|Documents| UserModel
    MongoDB -->|Documents| AnomalyModel
    MongoDB -->|Documents| SourceModel
    
    UserModel -->|Python Dict| Serializer
    AnomalyModel -->|Python Dict| Serializer
    SourceModel -->|Python Dict| Serializer
    
    Serializer -->|Validated Data| ResponseBuilder
    ResponseBuilder -->|JSON Response| APIClient
    APIClient -->|Data/Error| ReactApp
    
    %% Error Handling
    AuthMW -->|401 Unauthorized| ErrorHandler
    RateLimitMW -->|429 Too Many Requests| ErrorHandler
    MongoDB -->|Error| ErrorHandler
    ErrorHandler -->|Error Response| ReactApp
```

**API Endpoints:**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| GET | `/api/users/me` | Get current user | Yes |
| GET | `/api/anomalies` | List all anomalies | Yes |
| POST | `/api/anomalies` | Create anomaly log | Yes |
| GET | `/api/sources` | List data sources | Yes |
| POST | `/api/sources` | Add data source | Yes |
| DELETE | `/api/sources/{id}` | Remove data source | Yes |

---

## Process Specifications

### Process 1: Compute Persistence Diagram
**Input**: WikipediaEvent[], windowMs: number
**Output**: PersistencePoint[]
**Logic**:
1. Filter events within time window
2. Build user-page bipartite graph
3. Compute edge weights (edit frequency, delta)
4. Apply Vietoris-Rips filtration
5. Extract homology features (H0, H1, H2)
6. Return persistence pairs

### Process 2: Detect Anomalies (Multi-Modal)
**Input**: PersistenceDiagram, editRate: number
**Output**: AnomalyScore
**Logic**:
1. Compute Wasserstein distance to baseline
2. Calculate landscape norm deviation (z-score)
3. Compute statistical component (edit rate spike)
4. Weighted combination: `score = 0.4*W + 0.4*L + 0.2*S`
5. Confidence based on baseline size
6. Threshold: `isAnomaly = score > 3.0`

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        React[React SPA<br/>Vite + TypeScript]
        Worker[Web Worker<br/>TDA Computation]
    end
    
    subgraph "Vercel Edge"
        Static[Static Assets<br/>CDN Cached]
        SSR[SSR Functions<br/>Optional]
    end
    
    subgraph "Backend (Vercel/Railway)"
        API[FastAPI Server<br/>Python 3.11]
        WS[WebSocket<br/>Optional Real-time]
    end
    
    subgraph "External Services"
        MongoDB[(MongoDB Atlas<br/>M0 Free Tier)]
        WikiAPI[Wikimedia<br/>EventStreams]
    end
    
    React <--> Worker
    React --> Static
    React --> API
    API --> MongoDB
    React --> WikiAPI
```

**Technology Stack:**
- **Frontend**: React 18, TypeScript, TailwindCSS, Recharts, Three.js
- **Backend**: FastAPI, Python 3.11, Pydantic, Motor (async MongoDB)
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (Frontend), Railway/Vercel (Backend)
- **CI/CD**: GitHub Actions

---

## Security & Performance Considerations

**Security:**
- JWT-based authentication
- HTTPS/TLS for all connections
- Environment variable management
- CORS configuration
- Rate limiting on API endpoints

**Performance:**
- Web Workers for CPU-intensive TDA
- Event ring buffer (O(1) insertions)
- Incremental persistence updates
- Lazy loading for visualizations
- Production build optimization (tree-shaking, code splitting)

---

**Document Version**: 1.0
**Last Updated**: 2026-01-11
**Author**: TopoShape Insights Team
