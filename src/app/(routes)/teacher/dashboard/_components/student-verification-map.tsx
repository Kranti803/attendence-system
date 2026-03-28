"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, CheckCircle2, XCircle, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock student data for the verification map
const mockStudents = [
  {
    id: "s1",
    name: "Alice Johnson",
    distance: 15,
    isInside: true,
    timestamp: "09:15:22 AM",
    livenessScore: 98.5,
    livenessPassed: true,
    mapPosition: { x: 8, y: -12 }, // Percentage offset from center
  },
  {
    id: "s2",
    name: "Bob Williams",
    distance: 120,
    isInside: false,
    timestamp: "09:14:05 AM",
    livenessScore: 97.2,
    livenessPassed: true,
    mapPosition: { x: 35, y: 25 },
  },
  {
    id: "s3",
    name: "Charlie Brown",
    distance: 45,
    isInside: true,
    timestamp: "09:12:44 AM",
    livenessScore: 65.1,
    livenessPassed: false,
    mapPosition: { x: -15, y: -18 },
  },
  {
    id: "s4",
    name: "Diana Ross",
    distance: 85,
    isInside: false,
    timestamp: "09:10:12 AM",
    livenessScore: 99.1,
    livenessPassed: true,
    mapPosition: { x: -28, y: 15 },
  },
  {
    id: "s5",
    name: "Ethan Hunt",
    distance: 5,
    isInside: true,
    timestamp: "09:08:33 AM",
    livenessScore: 99.8,
    livenessPassed: true,
    mapPosition: { x: -2, y: 4 },
  },
];

export function StudentVerificationMap() {
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);

  return (
    <Card className="w-full overflow-hidden border shadow-xs bg-background">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Student Verification Map
        </CardTitle>
        <CardDescription>
          Real-time geospatial verification for the current classroom session
        </CardDescription>
      </CardHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x border-t">
        
        {/* Left Panel: Student List */}
        <div className="lg:col-span-4 bg-muted/10 h-[500px] flex flex-col">
          <div className="p-4 border-b bg-background sticky top-0 z-10 shadow-sm">
            <h3 className="text-sm font-semibold flex items-center justify-between">
              Verification Queue
              <Badge variant="outline" className="font-normal text-xs">{mockStudents.length} Students</Badge>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {mockStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={cn(
                  "w-full text-left flex items-start p-3 gap-3 rounded-xl transition-all border",
                  selectedStudent.id === student.id 
                    ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20 shadow-sm" 
                    : "bg-background border-border hover:bg-muted/50"
                )}
              >
                <div className="relative mt-0.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {/* Status Indicator Dot */}
                  <span className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                    student.isInside ? "bg-emerald-500" : "bg-destructive"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <span className="text-[10px] text-muted-foreground">{student.distance}m</span>
                  </div>
                  
                  <div className="flex gap-1.5 flex-wrap">
                    <Badge variant="secondary" className={cn(
                      "text-[9px] px-1.5 py-0 rounded",
                      student.isInside ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-destructive/10 text-destructive"
                    )}>
                      {student.isInside ? 'Inside Range' : 'Too Far'}
                    </Badge>
                    {!student.livenessPassed && (
                      <Badge variant="destructive" className="text-[9px] px-1.5 py-0 rounded">
                        Failed Liveness
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Map & Verification Details */}
        <div className="lg:col-span-8 flex flex-col h-[500px]">
          {/* Virtual Map Render */}
          <div className="flex-1 relative bg-slate-50 dark:bg-slate-950 overflow-hidden isolate">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            
            {/* Legend */}
            <div className="absolute top-4 left-4 z-30 bg-background/90 backdrop-blur-sm border rounded-lg p-2 text-[10px] space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
                <span className="text-muted-foreground">Classroom Geofence (50m)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-muted-foreground">Classroom Center</span>
              </div>
            </div>
            
            {/* Map Center elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-10">
              
              {/* Geofence Ring (Scaling to represent 50m radius) */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/30 bg-emerald-500/5 transition-all duration-300 pointer-events-none"
                style={{ width: '200px', height: '200px' }} 
              />
              
              {/* Center Classroom Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                <MapPin className="h-8 w-8 text-primary drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]" />
                <div className="absolute top-full mt-1 px-1.5 py-0.5 rounded shadow-sm bg-background border text-[9px] font-bold text-foreground">ROOM 201</div>
              </div>

              {/* Student Map Pin position relative to center */}
              <div 
                className="absolute transition-all duration-700 cubic-bezier(0.34,1.56,0.64,1) flex flex-col items-center z-20 group"
                style={{
                  top: `calc(50% + ${selectedStudent.mapPosition.y}%)`,
                  left: `calc(50% + ${selectedStudent.mapPosition.x}%)`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Distance Indicator Line if within view (stylized as a dotted line to center) */}
                <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none -z-10 opacity-40 transition-opacity" style={{ width: 0, height: 0 }}>
                  <line 
                    x1="0" 
                    y1="0" 
                    x2={`${-selectedStudent.mapPosition.x * 3}px`} 
                    y2={`${-selectedStudent.mapPosition.y * 3}px`} 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                    className="text-muted-foreground"
                  />
                </svg>

                <div className={cn(
                  "relative h-8 w-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors",
                  selectedStudent.isInside ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950" : "bg-destructive/10 border-destructive text-destructive dark:bg-destructive/20"
                )}>
                  <User className="h-4 w-4" />
                  
                  {/* Ping Animation for Student */}
                  <div className={cn(
                    "absolute -inset-1 rounded-full animate-ping opacity-20",
                    selectedStudent.isInside ? "bg-emerald-500" : "bg-destructive"
                  )}></div>
                </div>
                
                <div className="absolute top-full mt-2 bg-background/95 backdrop-blur-sm shadow-sm border rounded-md px-2 py-1 text-center min-w-max">
                  <p className="text-[10px] font-bold">{selectedStudent.name}</p>
                  <p className="text-[9px] text-muted-foreground">{selectedStudent.distance}m away</p>
                </div>
              </div>

            </div> {/* End Map Center */}
          </div>

          {/* Verification Metrics Footer */}
          <div className="bg-background border-t p-4 z-20 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              
              <div className="space-y-1 p-3 rounded-lg bg-muted/30 border border-muted-foreground/10">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Location Status</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedStudent.isInside ? (
                    <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-sm font-medium">Inside 50m</span></>
                  ) : (
                     <><XCircle className="h-4 w-4 text-destructive" /><span className="text-sm font-medium text-destructive">Outside Range</span></>
                  )}
                </div>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-muted/30 border border-muted-foreground/10">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Distance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xl font-bold font-mono tracking-tight",
                    selectedStudent.isInside ? "text-foreground" : "text-destructive"
                  )}>
                    {selectedStudent.distance}<span className="text-sm font-medium text-muted-foreground ml-0.5">m</span>
                  </span>
                </div>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-muted/30 border border-muted-foreground/10">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Liveness Check</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedStudent.livenessPassed ? (
                    <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-sm font-medium">{selectedStudent.livenessScore}% Score</span></>
                  ) : (
                    <><AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-sm font-medium text-destructive">Failed Check</span></>
                  )}
                </div>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-muted/30 border border-muted-foreground/10">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Timestamp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium font-mono">{selectedStudent.timestamp}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
