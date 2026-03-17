"use client";

import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

/* ─── SVG Chart: Attendance Trends (Line) ─── */
function AttendanceTrendChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const values = [87, 91, 85, 93, 89, 94];
  const max = 100;
  const h = 220;
  const w = 500;
  const padX = 45;
  const padY = 20;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  const points = values
    .map((v, i) => {
      const x = padX + (i / (values.length - 1)) * chartW;
      const y = padY + chartH - (v / max) * chartH;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${padX},${padY + chartH} ${points} ${padX + chartW},${padY + chartH}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((v) => {
        const y = padY + chartH - (v / max) * chartH;
        return (
          <g key={v}>
            <line x1={padX} y1={y} x2={padX + chartW} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
            <text x={padX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8">
              {v}%
            </text>
          </g>
        );
      })}
      <polygon points={areaPoints} fill="url(#trendGrad)" />
      <polyline points={points} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const x = padX + (i / (values.length - 1)) * chartW;
        const y = padY + chartH - (v / max) * chartH;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#4F46E5" stroke="white" strokeWidth="2" />
            <text x={x} y={h - 4} textAnchor="middle" fontSize="11" fill="#64748B" fontWeight="500">
              {months[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Chart: Department Comparison (Bar) ─── */
function DepartmentChart() {
  const departments = [
    { name: "CS", value: 94, color: "#4F46E5" },
    { name: "Math", value: 88, color: "#818CF8" },
    { name: "Physics", value: 82, color: "#A5B4FC" },
    { name: "Eng", value: 91, color: "#6366F1" },
    { name: "Bio", value: 86, color: "#C7D2FE" },
  ];
  const max = 100;
  const h = 220;
  const w = 500;
  const padX = 45;
  const padY = 20;
  const chartH = h - padY * 2;
  const barW = 48;
  const gap = (w - padX * 2 - departments.length * barW) / (departments.length + 1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {[0, 25, 50, 75, 100].map((v) => {
        const y = padY + chartH - (v / max) * chartH;
        return (
          <g key={v}>
            <line x1={padX} y1={y} x2={w - padX} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
            <text x={padX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8">
              {v}%
            </text>
          </g>
        );
      })}
      {departments.map((d, i) => {
        const x = padX + gap + i * (barW + gap);
        const barH = (d.value / max) * chartH;
        const y = padY + chartH - barH;
        return (
          <g key={d.name}>
            <rect x={x} y={y} width={barW} height={barH} rx={6} fill={d.color} opacity={0.85} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="11" fill="#334155" fontWeight="600">
              {d.value}%
            </text>
            <text x={x + barW / 2} y={h - 4} textAnchor="middle" fontSize="11" fill="#64748B" fontWeight="500">
              {d.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Chart: Recognition Success Rate (Donut) ─── */
function RecognitionDonut() {
  const value = 96.8;
  const radius = 70;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#4F46E5"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
        />
        <text x="90" y="85" textAnchor="middle" fontSize="28" fontWeight="700" fill="#0F172A">
          {value}%
        </text>
        <text x="90" y="105" textAnchor="middle" fontSize="12" fill="#64748B">
          Success Rate
        </text>
      </svg>
    </div>
  );
}

/* ─── Page ─── */
export default function AnalyticsPage() {
  return (
    <>
      <TopNavbar title="Analytics" userInitials="AU" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            In-depth attendance analytics and face recognition performance.
          </p>
        </div>

        {/* ── Recognition Stats Row ── */}
        <div className="grid gap-4 sm:grid-cols-3 stagger-children">
          <Card className="relative overflow-hidden">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Successful Recognitions</p>
                <p className="text-2xl font-bold">12,847</p>
                <p className="text-xs text-emerald-600 font-medium">96.8% accuracy</p>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Confidence</p>
                <p className="text-2xl font-bold">284</p>
                <p className="text-xs text-amber-600 font-medium">2.1% of attempts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed Recognitions</p>
                <p className="text-2xl font-bold">146</p>
                <p className="text-xs text-red-600 font-medium">1.1% failure rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Charts Row ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Attendance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>
                Monthly attendance rate across all departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTrendChart />
            </CardContent>
          </Card>

          {/* Department Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Department Comparison</CardTitle>
              <CardDescription>
                Average attendance rate by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentChart />
            </CardContent>
          </Card>
        </div>

        {/* ── Donut + Breakdown ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Recognition Rate</CardTitle>
              <CardDescription>
                Face recognition accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecognitionDonut />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="text-sm">Successful</span>
                  </div>
                  <span className="text-sm font-semibold">96.8%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-warning" />
                    <span className="text-sm">Low Confidence</span>
                  </div>
                  <span className="text-sm font-semibold">2.1%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
                    <span className="text-sm">Failed</span>
                  </div>
                  <span className="text-sm font-semibold">1.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Attendance by Time Slot</CardTitle>
              <CardDescription>
                Busiest check‑in windows today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "8:00 - 9:00 AM", pct: 92, count: 345 },
                  { time: "9:00 - 10:00 AM", pct: 98, count: 412 },
                  { time: "10:00 - 11:00 AM", pct: 74, count: 267 },
                  { time: "11:00 - 12:00 PM", pct: 65, count: 198 },
                  { time: "1:00 - 2:00 PM", pct: 88, count: 310 },
                  { time: "2:00 - 3:00 PM", pct: 70, count: 245 },
                ].map((slot) => (
                  <div key={slot.time} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {slot.time}
                      </span>
                      <span className="text-muted-foreground">
                        {slot.count} check‑ins · {slot.pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${slot.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
