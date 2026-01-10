import { render, screen, fireEvent } from '@/tests/utils/test-utils';
import Network3D from '@/components/visualizations/Network3D';
import { vi } from 'vitest';

// Mock React Three Fiber and Drei components since they need WebGL
// We mock them to render simple divs that we can assert on
vi.mock('@react-three/fiber', () => ({
    Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
    useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
    OrbitControls: () => <div data-testid="orbit-controls" />,
    Sphere: ({ children }: { children: React.ReactNode }) => <div data-testid="node">{children}</div>,
    Line: () => <div data-testid="link" />,
}));

// Mock useWikipediaData
const mockContextEvents = [
    { user: 'User1', bot: false },
    { user: 'Bot1', bot: true },
];

vi.mock('@/context/WikipediaDataContext', () => ({
    useWikipediaData: () => ({
        events: mockContextEvents
    }),
}));

describe('Network3D Component', () => {
    test('renders the 3D canvas', () => {
        render(<Network3D />);
        expect(screen.getByTestId('canvas')).toBeInTheDocument();
        expect(screen.getByText('3D Network Topology')).toBeInTheDocument();
    });

    test('renders nodes based on events', () => {
        render(<Network3D />);
        // We expect at least the nodes from our mock data
        const nodes = screen.getAllByTestId('node');
        expect(nodes.length).toBeGreaterThanOrEqual(mockContextEvents.length);
    });

    test('renders orbit controls for interaction', () => {
        render(<Network3D />);
        expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
    });

    test('renders with custom class name', () => {
        const { container } = render(<Network3D className="custom-class" />);
        // The card wrapping the component should have the class
        expect(container.firstChild).toHaveClass('custom-class');
    });

    // Note: Testing actual 3D interactions (zoom, rotate) is difficult without E2E tests properly spinning up WebGL.
    // Unit tests here focus on ensuring the scene graph is constructed correctly based on props/context.
});
