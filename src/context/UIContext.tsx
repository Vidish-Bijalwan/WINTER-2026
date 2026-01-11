import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
    isSidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    return (
        <UIContext.Provider value={{ isSidebarCollapsed, setSidebarCollapsed, toggleSidebar }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
