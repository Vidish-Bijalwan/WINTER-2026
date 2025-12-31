import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileCode } from "lucide-react";

export default function ExportTools({ className }: { className?: string }) {
    return (
        <Card className={`p-4 ${className}`}>
            <h3 className="font-semibold text-sm mb-4">Data Export</h3>
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                    <FileJson className="w-4 h-4" />
                    JSON Dump
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                    <FileCode className="w-4 h-4" />
                    Jupyter NB
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="w-4 h-4" />
                    CSV Report
                </Button>
            </div>
        </Card>
    );
}
