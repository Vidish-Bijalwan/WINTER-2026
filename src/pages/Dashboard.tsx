import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import LiveEventFeed from "@/components/LiveEventFeed";
import AnomalyTimeline from "@/components/AnomalyTimeline";
import ThreatIntelCard from "@/components/ThreatIntelCard";
import PersistenceDiagram from "@/components/PersistenceDiagram";

// Sortable Item Wrapper
function SortableItem({ id, children }: { id: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group h-full">
      <div {...attributes} {...listeners} className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 bg-slate-800 rounded">
        <GripVertical className="w-4 h-4 text-slate-400" />
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [items, setItems] = useState(['feed', 'timeline', 'threats', 'topology']);

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

  const renderWidget = (id: string) => {
    switch (id) {
      case 'feed': return <LiveEventFeed />;
      case 'timeline': return <AnomalyTimeline />;
      case 'threats': return <ThreatIntelCard />;
      case 'topology': return <PersistenceDiagram />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto transition-all duration-300 md:pl-[280px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Widget</Button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((id) => (
                <SortableItem key={id} id={id}>
                  {renderWidget(id)}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
}
