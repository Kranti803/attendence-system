"use client";

import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

/* ─── Static Data ─── */
const stats = [
  {
    label: "Total Students",
    value: "1,234",
    change: "+12%",
    trend: "up" as const,
    icon: Users,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "Total Teachers",
    value: "56",
    change: "+3%",
    trend: "up" as const,
    icon: GraduationCap,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Total Classes",
    value: "24",
    change: "0%",
    trend: "neutral" as const,
    icon: BookOpen,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Today's Attendance",
    value: "94.2%",
    change: "+2.1%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "bg-violet-50 text-violet-600",
  },
];

const recentActivity = [
  { time: "09:15 AM", student: "Alice Johnson", action: "Checked In", class: "CS101", status: "Present" },
  { time: "09:14 AM", student: "Bob Williams", action: "Checked In", class: "CS101", status: "Present" },
  { time: "09:12 AM", student: "Charlie Brown", action: "Late Arrival", class: "MATH201", status: "Late" },
  { time: "09:10 AM", student: "Diana Ross",   action: "Checked In", class: "PHY301", status: "Present" },
  { time: "09:08 AM", student: "Ethan Hunt",   action: "Checked In", class: "CS101", status: "Present" },
  { time: "09:05 AM", student: "Fiona Apple",  action: "Absent",     class: "ENG102", status: "Absent" },
  { time: "08:58 AM", student: "George Lucas",   action: "Checked In", class: "MATH201", status: "Present" },
];

/* ─── SVG Chart: Weekly Attendance ─── */
function WeeklyChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const values = [88, 92, 85, 94, 91, 78, 94];
  const max = 100;
  const h = 200;
  const w = 500;
  const padX = 40;
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
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
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
      {/* Area */}
      <polygon points={areaPoints} fill="url(#lineGrad)" />
      {/* Line */}
      <polyline points={points} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots & labels */}
      {values.map((v, i) => {
        const x = padX + (i / (values.length - 1)) * chartW;
        const y = padY + chartH - (v / max) * chartH;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#4F46E5" stroke="white" strokeWidth="2" />
            <text x={x} y={h - 4} textAnchor="middle" fontSize="11" fill="#64748B" fontWeight="500">
              {days[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Page ─── */
export default function AdminDashboardPage() {
  return (
    <>
      <TopNavbar title="Dashboard" userInitials="AU" />
      <div className="p-6 space-y-6">
        {/* ── Stats Cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {stats.map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === "up"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change} from last week
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Chart + Activity ── */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Weekly Attendance Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Attendance Trend</CardTitle>
                <Badge variant="default">This Week</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <WeeklyChart />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary text-xs font-semibold">
                    {item.student
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.student}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.action} · {item.class}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant={
                        item.status === "Present"
                          ? "success"
                          : item.status === "Late"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Full Activity Table ── */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {item.time}
                    </TableCell>
                    <TableCell className="font-medium">{item.student}</TableCell>
                    <TableCell>{item.action}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.class}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Present"
                            ? "success"
                            : item.status === "Late"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
