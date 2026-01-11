import { Skeleton } from "@/components/ui/skeleton";

export function WidgetSkeleton() {
    return (
        <div className="p-4 space-y-4 h-full">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-slate-800" />
                    <Skeleton className="h-4 w-[200px] bg-slate-800" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-3/4 bg-slate-800" />
            </div>
            <div className="pt-4 grid grid-cols-3 gap-4">
                <Skeleton className="h-20 w-full bg-slate-800" />
                <Skeleton className="h-20 w-full bg-slate-800" />
                <Skeleton className="h-20 w-full bg-slate-800" />
            </div>
        </div>
    );
}
