import { computePersistenceDiagram, PersistencePoint } from './topologyAnalysis';
import { MultiModalDetector } from './tda/multimodal';
import { computeWassersteinDistance, computeBottleneckDistance } from './tda/wasserstein';
import { computePersistenceLandscapes, computeLandscapeNorm } from './tda/landscapes';

// Mock Data Generation
function generateMockEvents(count: number, anomaly: boolean = false) {
    const events = [];
    for (let i = 0; i < count; i++) {
        events.push({
            id: `evt-${i}`,
            type: 'edit' as const,
            title: `Page ${i % 10}`,
            user: `User ${i % 5}`,
            bot: false,
            minor: false,
            namespace: 0,
            timestamp: new Date(Date.now() - (count - i) * 1000),
            delta: anomaly ? Math.random() * 10000 : Math.random() * 100,
            wiki: 'enwiki',
            serverUrl: 'https://en.wikipedia.org'
        });
    }
    return events;
}

// Test Suite
async function runTests() {
    console.log('🧪 Starting TDA Verification Tests...\n');

    // Test 1: Persistence Diagram Computation
    console.log('Test 1: Persistence Diagram Computation');
    const normalEvents = generateMockEvents(50, false);
    const diagram1 = computePersistenceDiagram(normalEvents, 60000);
    console.log(`✅ Computed ${diagram1.length} features for normal data.`);

    if (diagram1.length === 0) {
        console.warn('⚠️ Warning: No features detected. Check filtration parameters.');
    }

    // Test 2: Wasserstein Distance
    console.log('\nTest 2: Wasserstein Distance');
    const anomalyEvents = generateMockEvents(50, true);
    const diagram2 = computePersistenceDiagram(anomalyEvents, 60000);
    const dist = computeWassersteinDistance(diagram1, diagram2);
    console.log(`✅ Wasserstein Distance (Normal vs Anomaly): ${dist.toFixed(4)}`);

    const selfDist = computeWassersteinDistance(diagram1, diagram1);
    console.log(`✅ Wasserstein Distance (Self): ${selfDist.toFixed(4)} (Expected: 0)`);

    // Test 3: Persistence Landscapes
    console.log('\nTest 3: Persistence Landscapes');
    const landscapes = computePersistenceLandscapes(diagram1, 5, 100);
    const landscape = landscapes[0]; // Take first layer of first dimension
    const norm = computeLandscapeNorm(landscape);
    console.log(`✅ Landscape Norm: ${norm.toFixed(4)}`);

    // Test 4: Multi-Modal Detector
    console.log('\nTest 4: Multi-Modal Detector');
    const detector = new MultiModalDetector(10);

    // Train baseline
    console.log('Training baseline...');
    for (let i = 0; i < 5; i++) {
        const events = generateMockEvents(50, false);
        const diag = computePersistenceDiagram(events, 60000);
        detector.addToBaseline(diag);
    }

    // Detect normal
    const normalScore = detector.detect(diagram1, 1.0);
    console.log(`Normal Score: ${normalScore.totalScore.toFixed(4)} (Anomaly: ${normalScore.isAnomaly})`);

    // Detect anomaly
    const anomalyScore = detector.detect(diagram2, 10.0);
    console.log(`Anomaly Score: ${anomalyScore.totalScore.toFixed(4)} (Anomaly: ${anomalyScore.isAnomaly})`);

    if (anomalyScore.totalScore > normalScore.totalScore) {
        console.log('✅ Anomaly correctly scored higher than normal data.');
    } else {
        console.error('❌ Anomaly detection failed: Anomaly score not higher than normal.');
    }

    console.log('\n✨ All tests completed.');
}

// Run
runTests().catch(console.error);
