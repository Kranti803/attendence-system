"use client";

import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, Calendar } from "lucide-react";

/* ─── Static Data ─── */
const history = [
  { date: "2026-03-17", day: "Monday",    subject: "CS101 — Intro to CS",        time: "09:00 AM", status: "Present" },
  { date: "2026-03-17", day: "Monday",    subject: "MATH201 — Linear Algebra",   time: "02:00 PM", status: "Present" },
  { date: "2026-03-16", day: "Sunday",    subject: "PHY301 — Quantum Physics",   time: "10:00 AM", status: "Absent" },
  { date: "2026-03-16", day: "Sunday",    subject: "ENG102 — Technical Writing", time: "01:00 PM", status: "Present" },
  { date: "2026-03-15", day: "Saturday",  subject: "CS101 — Intro to CS",        time: "09:00 AM", status: "Present" },
  { date: "2026-03-14", day: "Friday",    subject: "MATH201 — Linear Algebra",   time: "02:00 PM", status: "Present" },
  { date: "2026-03-14", day: "Friday",    subject: "PHY301 — Quantum Physics",   time: "10:00 AM", status: "Absent" },
  { date: "2026-03-13", day: "Thursday",  subject: "CS101 — Intro to CS",        time: "09:00 AM", status: "Present" },
  { date: "2026-03-13", day: "Thursday",  subject: "ENG102 — Technical Writing", time: "01:00 PM", status: "Present" },
  { date: "2026-03-12", day: "Wednesday", subject: "MATH201 — Linear Algebra",   time: "02:00 PM", status: "Absent" },
];

export default function AttendanceHistoryPage() {
  const totalPresent = history.filter((h) => h.status === "Present").length;
  const totalAbsent = history.filter((h) => h.status === "Absent").length;

  return (
    <>
      <TopNavbar title="Attendance History" userInitials="JD" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Attendance History
            </h1>
            <p className="text-sm text-muted-foreground">
              Your complete attendance record for this semester.
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-3xl font-bold text-foreground mt-1">{history.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{totalPresent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{totalAbsent}</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Filters ── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by subject…" className="pl-9" />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" className="pl-9 w-44" defaultValue="2026-03-12" />
              </div>
              <Button variant="outline" size="default">
                <Filter className="h-4 w-4" />
                Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── History Table ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed History</CardTitle>
              <Badge variant="secondary">{history.length} records</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((h, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {h.date}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {h.day}
                    </TableCell>
                    <TableCell className="font-medium">{h.subject}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {h.time}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={h.status === "Present" ? "success" : "destructive"}
                        className="min-w-[72px] justify-center"
                      >
                        {h.status}
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
