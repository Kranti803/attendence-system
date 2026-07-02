"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";

/* ─── SVG Chart: Attendance Trends (Line) ─── */
function AttendanceTrendChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground">No data available</div>;
  }

  // Use last 6 months for chart
  const chartData = data.slice(-6);
  const values = chartData.map(d => d.rate);
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

  // Format labels - use day of month
  const labels = chartData.map((d, i) => {
    const date = new Date(d.date);
    return date.getDate().toString();
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((v) => {
        const y = padY + chartH - (v / max) * chartH;
        return (
          <g key={v}>
            <line x1={padX} y1={y} x2={padX + chartW} y2={y} stroke="currentColor" strokeOpacity="0.12" strokeDasharray="4 4" />
            <text x={padX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity="0.55">
              {v}%
            </text>
          </g>
        );
      })}
      <polygon points={areaPoints} fill="url(#trendGrad)" />
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const x = padX + (i / (values.length - 1)) * chartW;
        const y = padY + chartH - (v / max) * chartH;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="currentColor" stroke="white" strokeWidth="2" />
            <text x={x} y={h - 4} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7" fontWeight="500">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Chart: Department Comparison (Bar) ─── */
function DepartmentChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground">No data available</div>;
  }

  const departments = data.slice(0, 5); // Top 5 departments
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
            <line x1={padX} y1={y} x2={w - padX} y2={y} stroke="currentColor" strokeOpacity="0.12" strokeDasharray="4 4" />
            <text x={padX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity="0.55">
              {v}%
            </text>
          </g>
        );
      })}
      {departments.map((d, i) => {
        const x = padX + gap + i * (barW + gap);
        const barH = (d.rate / max) * chartH;
        const y = padY + chartH - barH;
        const deptName = d.name.substring(0, 3).toUpperCase();
        return (
          <g key={d.name}>
            <rect x={x} y={y} width={barW} height={barH} rx={6} fill="currentColor" opacity={0.75} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.85" fontWeight="600">
              {d.rate}%
            </text>
            <text x={x + barW / 2} y={h - 4} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7" fontWeight="500">
              {deptName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Chart: Recognition Success Rate (Donut) ─── */
function RecognitionDonut({ successRate }: { successRate: number }) {
  const value = successRate || 96.8;
  const radius = 70;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-4 text-primary">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth={stroke} />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
        />
        <text x="90" y="85" textAnchor="middle" fontSize="28" fontWeight="700" fill="currentColor">
          {value.toFixed(1)}%
        </text>
        <text x="90" y="105" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">
          Success Rate
        </text>
      </svg>
    </div>
  );
}

/* ─── Page ─── */
export default function AnalyticsPage() {
  const { data: analyticsData, isLoading } = useAnalyticsOverview();

  if (isLoading) {
    return (
      <>
        <TopNavbar title="Analytics" userInitials="AU" />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!analyticsData) {
    return (
      <>
        <TopNavbar title="Analytics" userInitials="AU" />
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load analytics data</p>
          </div>
        </div>
      </>
    );
  }

  const recognitionStats = analyticsData.recognitionStats || {};
  const attendanceTrends = analyticsData.attendanceTrends || [];
  const departmentComparison = analyticsData.departmentComparison || [];
  const timeSlotDistribution = analyticsData.timeSlotDistribution || [];

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
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="relative overflow-hidden">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Successful Recognitions</p>
                <p className="text-2xl font-bold">{(recognitionStats.successfulRecognitions || 0).toLocaleString()}</p>
                <p className="text-xs text-emerald-600 font-medium">{recognitionStats.successRate || 0}% accuracy</p>
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
                <p className="text-2xl font-bold">{(recognitionStats.lowConfidence || 0).toLocaleString()}</p>
                <p className="text-xs text-amber-600 font-medium">
                  {recognitionStats.totalAttempts > 0 
                    ? ((recognitionStats.lowConfidence / recognitionStats.totalAttempts * 100).toFixed(1))
                    : 0}% of attempts
                </p>
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
                <p className="text-2xl font-bold">{(recognitionStats.failedRecognitions || 0).toLocaleString()}</p>
                <p className="text-xs text-red-600 font-medium">
                  {recognitionStats.totalAttempts > 0 
                    ? ((recognitionStats.failedRecognitions / recognitionStats.totalAttempts * 100).toFixed(1))
                    : 0}% failure rate
                </p>
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
                Attendance rate over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-primary">
                <AttendanceTrendChart data={attendanceTrends} />
              </div>
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
              <div className="text-primary">
                <DepartmentChart data={departmentComparison} />
              </div>
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
              <RecognitionDonut successRate={recognitionStats.successRate || 0} />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="text-sm">Successful</span>
                  </div>
                  <span className="text-sm font-semibold">{(recognitionStats.successRate || 0).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-warning" />
                    <span className="text-sm">Low Confidence</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {recognitionStats.totalAttempts > 0 
                      ? ((recognitionStats.lowConfidence / recognitionStats.totalAttempts * 100).toFixed(1))
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
                    <span className="text-sm">Failed</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {recognitionStats.totalAttempts > 0 
                      ? ((recognitionStats.failedRecognitions / recognitionStats.totalAttempts * 100).toFixed(1))
                      : 0}%
                  </span>
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
                {timeSlotDistribution.length > 0 ? (
                  timeSlotDistribution.map((slot) => (
                    <div key={slot.time} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {slot.time}
                        </span>
                        <span className="text-muted-foreground">
                          {slot.count} check‑ins · {slot.rate}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${slot.rate}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No data available for today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
