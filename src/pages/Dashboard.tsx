import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import LiveEventFeed from "@/components/LiveEventFeed";
import AnomalyTimeline from "@/components/AnomalyTimeline";
import ThreatIntelCard from "@/components/ThreatIntelCard";
import PersistenceDiagram from "@/components/PersistenceDiagram";
import { DashboardWidget } from "@/components/DashboardWidget";
import { AddWidgetDialog, AVAILABLE_WIDGETS } from "@/components/AddWidgetDialog";
import { useToast } from "@/hooks/use-toast";

import { WidgetSkeleton } from "@/components/WidgetSkeleton";
import { OnboardingTour } from "@/components/OnboardingTour";
import { TDAStats } from "@/components/TDAStats";
import { PersistenceBarcode } from "@/components/tda-viz/PersistenceBarcode";
import { BirthDeathPlane } from "@/components/tda-viz/BirthDeathPlane";
import { FiltrationAnimation } from "@/components/tda-viz/FiltrationAnimation";
import { useWikipediaData } from "@/context/WikipediaDataContext";

// Wrapper components to provide data
const PersistenceBarcodeWrapper = () => {
  const { persistenceDiagram } = useWikipediaData();
  return <PersistenceBarcode data={persistenceDiagram} />;
};

const BirthDeathPlaneWrapper = () => {
  const { persistenceDiagram } = useWikipediaData();
  return <BirthDeathPlane data={persistenceDiagram} />;
};

const FiltrationAnimationWrapper = () => {
  const { persistenceDiagram } = useWikipediaData();
  return <FiltrationAnimation data={persistenceDiagram} />;
};

export default function Dashboard() {
  const [items, setItems] = useState(['feed', 'timeline', 'threats', 'topology']);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate initial data load
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveWidget = (id: string) => {
    setItems(items.filter(item => item !== id));
    toast({
      title: "Widget Removed",
      description: "The widget has been removed from your dashboard.",
    });
  };

  const handleAddWidget = (id: string) => {
    if (!items.includes(id)) {
      setItems([...items, id]);
      setIsAddWidgetOpen(false);
      toast({
        title: "Widget Added",
        description: "The widget has been added to your dashboard.",
      });
    }
  };

  const getWidgetTitle = (id: string) => {
    const widget = AVAILABLE_WIDGETS.find(w => w.id === id);
    return widget ? widget.title : 'Widget';
  };

  const renderWidgetContent = (id: string) => {
    if (isLoading) return <WidgetSkeleton />;

    switch (id) {
      case 'feed': return <LiveEventFeed className="h-full" />;
      case 'timeline': return <AnomalyTimeline />;
      case 'threats': return <ThreatIntelCard />;
      case 'topology': return <PersistenceDiagram />;
      case 'tda-stats': return <TDAStats />;
      case 'barcode': return <PersistenceBarcodeWrapper />;
      case 'birth-death': return <BirthDeathPlaneWrapper />;
      case 'filtration': return <FiltrationAnimationWrapper />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto transition-all duration-300 md:pl-[280px]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Real-time monitoring and anomaly detection.</p>
          </div>
          <Button size="sm" onClick={() => setIsAddWidgetOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Widget
          </Button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[400px]" data-tour="dashboard-widgets">
              {items.map((id) => (
                <DashboardWidget
                  key={id}
                  id={id}
                  title={getWidgetTitle(id)}
                  onRemove={handleRemoveWidget}
                  className={cn(id === 'timeline' ? 'lg:col-span-2' : '', "stagger-item")}
                >
                  {renderWidgetContent(id)}
                </DashboardWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <AddWidgetDialog
          open={isAddWidgetOpen}
          onOpenChange={setIsAddWidgetOpen}
          onAddWidget={handleAddWidget}
          activeWidgets={items}
        />
        <OnboardingTour />
      </main>
    </div>
  );
}
