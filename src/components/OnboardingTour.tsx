import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function OnboardingTour() {
    const startTour = () => {
        const driverObj = driver({
            showProgress: true,
            steps: [
                { element: 'nav', popover: { title: 'Navigation', description: 'Access all modules here. Collapse for more space.' } },
                { element: '[href="/dashboard"]', popover: { title: 'Dashboard', description: 'Your main command center.' } },
                { element: '[href="/monitor"]', popover: { title: 'System Monitor', description: 'Check system health and metrics.' } },
                { element: '[href="/visualizations"]', popover: { title: 'Visualizations', description: 'Explore advanced data views.' } },
                { element: 'button:has(.lucide-search)', popover: { title: 'Command Palette', description: 'Press Cmd+K to search anything.' } },
            ]
        });

        driverObj.drive();
    };

    return (
        <Button variant="ghost" size="icon" onClick={startTour} title="Start Tour">
            <HelpCircle className="w-4 h-4" />
        </Button>
    );
}
