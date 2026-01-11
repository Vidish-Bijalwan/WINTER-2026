import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function OnboardingTour() {
    const [hasSeenTour, setHasSeenTour] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem('toposhape_tour_seen');
        if (seen) {
            setHasSeenTour(true);
        } else {
            // Auto-start tour for new users after a short delay
            const timer = setTimeout(() => {
                startTour();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const startTour = () => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: 'nav',
                    popover: {
                        title: 'Welcome to TopoShape Insights',
                        description: 'Your advanced platform for topological data analysis and anomaly detection.',
                        side: 'right',
                        align: 'start',
                    },
                },
                {
                    element: '[data-tour="dashboard-widgets"]',
                    popover: {
                        title: 'Interactive Dashboard',
                        description: 'Drag and drop widgets to customize your view. Click the "Add Widget" button to add more.',
                        side: 'bottom',
                        align: 'start',
                    },
                },
                {
                    element: '[data-tour="theme-toggle"]',
                    popover: {
                        title: 'Theme & Customization',
                        description: 'Switch between Dark and Light modes here. Use Cmd+K to open the Command Palette for quick actions.',
                        side: 'bottom',
                        align: 'end',
                    },
                },
                {
                    element: '[data-tour="live-feed"]',
                    popover: {
                        title: 'Real-time Feed',
                        description: 'Watch live events stream in. TDA algorithms process these in real-time to detect anomalies.',
                        side: 'left',
                        align: 'start',
                    },
                },
                {
                    element: '[data-tour="topology-viz"]',
                    popover: {
                        title: 'Topological Analysis',
                        description: 'Visualize persistence diagrams and Betti numbers to understand the shape of your data.',
                        side: 'left',
                        align: 'start',
                    },
                },
            ],
            onDestroyStarted: () => {
                if (!driverObj.hasNextStep() || confirm('Are you sure you want to stop the tour?')) {
                    driverObj.destroy();
                    localStorage.setItem('toposhape_tour_seen', 'true');
                    setHasSeenTour(true);
                }
            },
        });

        driverObj.drive();
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="fixed bottom-4 right-4 z-50 rounded-full w-10 h-10 bg-primary/10 text-primary hover:bg-primary/20 shadow-lg backdrop-blur-sm border border-primary/20"
            onClick={startTour}
            title="Start Tour"
        >
            <HelpCircle className="w-5 h-5" />
        </Button>
    );
}
