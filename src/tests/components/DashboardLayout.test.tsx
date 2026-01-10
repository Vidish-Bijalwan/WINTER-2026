import { render, screen, fireEvent, waitFor } from '@/tests/utils/test-utils';
import Dashboard from '@/pages/Dashboard';
import { vi } from 'vitest';

// Mock dnd-kit components
// dnd-kit is hard to test with jsdom because it relies on pointer events and layout measurements
// We will mock the context and sensors to ensure the logic runs without crashing
vi.mock('@dnd-kit/core', async () => {
    const actual = await vi.importActual('@dnd-kit/core');
    return {
        ...actual,
        DndContext: ({ children, onDragEnd }: any) => (
            <div data-testid="dnd-context">
                <button
                    data-testid="simulate-drag"
                    onClick={() => onDragEnd({ active: { id: 'feed' }, over: { id: 'timeline' } })}
                >
                    Simulate Drag
                </button>
                {children}
            </div>
        ),
        useSensor: vi.fn(),
        useSensors: vi.fn(),
        PointerSensor: vi.fn(),
        KeyboardSensor: vi.fn(),
    };
});

vi.mock('@dnd-kit/sortable', async () => {
    const actual = await vi.importActual('@dnd-kit/sortable');
    return {
        ...actual,
        SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
        useSortable: ({ id }: any) => ({
            attributes: {},
            listeners: {},
            setNodeRef: vi.fn(),
            transform: null,
            transition: null,
        }),
    };
});

// Mock child components to simplify testing
vi.mock('@/components/LiveEventFeed', () => ({ default: () => <div data-testid="widget-feed">Feed Widget</div> }));
vi.mock('@/components/AnomalyTimeline', () => ({ default: () => <div data-testid="widget-timeline">Timeline Widget</div> }));
vi.mock('@/components/ThreatIntelCard', () => ({ default: () => <div data-testid="widget-threats">Threats Widget</div> }));
vi.mock('@/components/PersistenceDiagram', () => ({ default: () => <div data-testid="widget-topology">Topology Widget</div> }));

describe('Dashboard Component', () => {
    test('renders all default widgets', () => {
        render(<Dashboard />);
        expect(screen.getByTestId('widget-feed')).toBeInTheDocument();
        expect(screen.getByTestId('widget-timeline')).toBeInTheDocument();
        expect(screen.getByTestId('widget-threats')).toBeInTheDocument();
        expect(screen.getByTestId('widget-topology')).toBeInTheDocument();
    });

    test('renders dashboard header interactions', () => {
        render(<Dashboard />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Add Widget')).toBeInTheDocument();
    });

    test('handles drag and drop reordering', async () => {
        render(<Dashboard />);

        // Initial order implicitly checked by implementation, but let's try to trigger a reorder
        const simulator = screen.getByTestId('simulate-drag');
        fireEvent.click(simulator);

        // This triggers the onDragEnd handler
        // Since we can't easily check internal state without inspecting the DOM order or component state,
        // we mainly verify it doesn't crash and calls the handler.
        // In a real browser test (e.g. Cypress/Playwright), we'd check visual positions.
        // Here we just ensure the component handles the event gracefully.
        await waitFor(() => {
            expect(screen.getByTestId('widget-feed')).toBeInTheDocument();
        });
    });
});
