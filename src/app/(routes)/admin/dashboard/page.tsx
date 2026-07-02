"use client";

import { useState, useEffect } from "react";
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
import {
  getDashboardStatsFn,
  WeeklyAttendanceData,
  RecentActivityItem,
  DashboardStats,
} from "@/services/dashboard.service";

interface StatConfig {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: string;
}

/* ─── Skeleton Loaders ─── */
function StatCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="mt-3 h-8 w-32 bg-muted rounded animate-pulse" />
            <div className="mt-3 h-3 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-11 w-11 bg-muted rounded-xl animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          <div className="h-6 w-20 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

function ActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5">
            <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              <div className="h-2 w-32 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-6 w-12 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-10 bg-muted rounded animate-pulse" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── SVG Chart: Weekly Attendance ─── */
function WeeklyChart({ data }: { data: WeeklyAttendanceData[] }) {
  const max = 100;
  const h = 200;
  const w = 500;
  const padX = 40;
  const padY = 20;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  const values = data.map((d) => d.rate);
  const days = data.map((d) => d.day);

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
          <stop offset="0%" stopColor="oklch(0.46 0.22 265)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="oklch(0.46 0.22 265)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((v) => {
        const y = padY + chartH - (v / max) * chartH;
        return (
          <g key={v}>
            <line
              x1={padX}
              y1={y}
              x2={padX + chartW}
              y2={y}
              stroke="oklch(0.91 0.01 260)"
              strokeDasharray="4 4"
            />
            <text
              x={padX - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="oklch(0.6 0.02 260)"
            >
              {v}%
            </text>
          </g>
        );
      })}
      <polygon points={areaPoints} fill="url(#lineGrad)" />
      <polyline
        points={points}
        fill="none"
        stroke="oklch(0.46 0.22 265)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const x = padX + (i / (values.length - 1)) * chartW;
        const y = padY + chartH - (v / max) * chartH;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="4"
              fill="oklch(0.46 0.22 265)"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={x}
              y={h - 4}
              textAnchor="middle"
              fontSize="11"
              fill="oklch(0.5 0.02 260)"
              fontWeight="500"
            >
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
  const [stats, setStats] = useState<StatConfig[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyAttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Single API call to backend for ALL stats
        const dashboardStats = await getDashboardStatsFn();

        // Safety check
        if (!dashboardStats) {
          throw new Error('No data received from dashboard API');
        }

        // Update stats cards
        const updatedStats: StatConfig[] = [
          {
            label: "Total Students",
            value: (dashboardStats.totalStudents || 0).toLocaleString(),
            change: "+12%",
            trend: "up",
            icon: <Users className="h-5 w-5" />,
            color: "bg-primary/10 text-primary",
          },
          {
            label: "Total Teachers",
            value: (dashboardStats.totalTeachers || 0).toLocaleString(),
            change: "+3%",
            trend: "up",
            icon: <GraduationCap className="h-5 w-5" />,
            color: "bg-emerald-500/10 text-emerald-600",
          },
          {
            label: "Total Classes",
            value: (dashboardStats.totalClasses || 0).toLocaleString(),
            change: "0%",
            trend: "neutral",
            icon: <BookOpen className="h-5 w-5" />,
            color: "bg-amber-500/10 text-amber-600",
          },
          {
            label: "Today's Attendance",
            value: `${dashboardStats.todayAttendanceRate || 0}%`,
            change: "+2.1%",
            trend: "up",
            icon: <TrendingUp className="h-5 w-5" />,
            color: "bg-violet-500/10 text-violet-600",
          },
        ];

        setStats(updatedStats);
        
        // Data is already formatted from backend, just use it directly
        setRecentActivity(dashboardStats.recentActivity || []);
        setWeeklyTrend(dashboardStats.weeklyAttendance || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Show loading skeleton while fetching
  if (isLoading) {
    return (
      <>
        <TopNavbar title="Dashboard" userInitials="AU" />
        <div className="p-6 space-y-6">
          {/* Stats Cards Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Chart + Activity Skeleton */}
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ChartSkeleton />
            </div>
            <div className="lg:col-span-2">
              <ActivitySkeleton />
            </div>
          </div>

          {/* Table Skeleton */}
          <TableSkeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <TopNavbar title="Dashboard" userInitials="AU" />
      <div className="p-6 space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {/* ── Stats Cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                      ) : stat.trend === "down" ? (
                        <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
                      ) : null}
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === "up"
                            ? "text-emerald-600"
                            : stat.trend === "down"
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stat.change} from last week
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    {stat.icon}
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
              {weeklyTrend.length > 0 ? (
                <WeeklyChart data={weeklyTrend} />
              ) : (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                  No attendance data available
                </div>
              )}
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
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {item.student
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
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
                            ? "default"
                            : item.status === "Late"
                            ? "secondary"
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
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No activity yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Full Activity Table ── */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
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
                  {recentActivity.map((item) => (
                    <TableRow key={item.id}>
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
                              ? "default"
                              : item.status === "Late"
                              ? "secondary"
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
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                No attendance records for today
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
