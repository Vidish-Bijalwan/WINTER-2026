import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WikipediaDataProvider } from '@/context/WikipediaDataContext';

// Create a custom render function with providers
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    route?: string;
    initialEntries?: MemoryRouterProps['initialEntries'];
}

const customRender = (
    ui: ReactElement,
    options: CustomRenderOptions = {}
) => {
    const { route = '/', initialEntries = [route], ...renderOptions } = options;

    const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
        const queryClient = createTestQueryClient();

        return (
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <WikipediaDataProvider>
                        <MemoryRouter initialEntries={initialEntries}>
                            {children}
                        </MemoryRouter>
                    </WikipediaDataProvider>
                </TooltipProvider>
            </QueryClientProvider>
        );
    };

    return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// Mock Data Generators
export const createMockAnomaly = (overrides = {}) => ({
    id: 'anomaly-123',
    source: 'wikipedia',
    timestamp: new Date().toISOString(),
    score: 0.85,
    betti_numbers: [10, 2, 0],
    ...overrides,
});

export const createMockUser = (overrides = {}) => ({
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'viewer',
    ...overrides,
});

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
