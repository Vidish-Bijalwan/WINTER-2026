import { useEffect, useState } from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { useWikipediaData } from '@/context/WikipediaDataContext';
import { Card } from '@/components/ui/card';

export default function CalendarHeatmap({ className }: { className?: string }) {
    const { events } = useWikipediaData();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Mock historical data for the calendar view (since we only have live stream)
        // In a real app, this would fetch historical aggregates
        const today = new Date();
        const mockData = [];

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            mockData.push({
                day: date.toISOString().split('T')[0],
                value: Math.floor(Math.random() * 100)
            });
        }

        setData(mockData);
    }, []);

    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Contribution Calendar</h3>
            <div className="h-[200px]">
                <ResponsiveCalendar
                    data={data}
                    from={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]}
                    to={new Date().toISOString().split('T')[0]}
                    emptyColor="#1e293b"
                    colors={['#1e293b', '#064e3b', '#065f46', '#047857', '#10b981']}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    yearSpacing={40}
                    monthBorderColor="#ffffff"
                    dayBorderWidth={2}
                    dayBorderColor="#0f172a"
                    theme={{
                        text: { fill: '#888888' },
                        tooltip: { container: { background: '#1e293b', color: '#fff' } }
                    }}
                />
            </div>
        </Card>
    );
}
