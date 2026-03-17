"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, ChevronLeft, Download, Filter, Search } from "lucide-react";

const subjectData: Record<
  string,
  {
    title: string;
    teacher: string;
    attendancePct: number;
    attended: number;
    total: number;
    sessions: { date: string; topic: string; status: "Present" | "Absent" | "Late" }[];
  }
> = {
  CS101: {
    title: "CS101 — Intro to CS",
    teacher: "Dr. Sarah Wilson",
    attendancePct: 92,
    attended: 23,
    total: 25,
    sessions: [
      { date: "2026-03-17", topic: "Arrays & Complexity", status: "Present" },
      { date: "2026-03-16", topic: "Stacks & Queues", status: "Present" },
      { date: "2026-03-14", topic: "Recursion", status: "Late" },
      { date: "2026-03-12", topic: "Intro / Setup", status: "Absent" },
    ],
  },
  MATH201: {
    title: "MATH201 — Linear Algebra",
    teacher: "Prof. James Carter",
    attendancePct: 88,
    attended: 21,
    total: 24,
    sessions: [
      { date: "2026-03-17", topic: "Eigenvectors", status: "Present" },
      { date: "2026-03-14", topic: "Determinants", status: "Present" },
      { date: "2026-03-12", topic: "Matrices", status: "Absent" },
    ],
  },
};

export default function StudentSubjectDetailPage() {
  const params = useParams<{ code: string }>();
  const code = String(params.code ?? "").toUpperCase();
  const data =
    subjectData[code] ??
    ({
      title: `${code} — Subject`,
      teacher: "—",
      attendancePct: 0,
      attended: 0,
      total: 0,
      sessions: [],
    } as const);

  return (
    <>
      <TopNavbar title="Subject" userInitials="JD" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/student/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-foreground">{data.title}</h1>
            <p className="text-sm text-muted-foreground">Instructor: {data.teacher}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Attendance</p>
              <p className="mt-1 text-3xl font-bold text-primary">{data.attendancePct}%</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {data.attended}/{data.total} sessions attended
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {data.sessions.filter((s) => s.status === "Present").length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Absent / Late</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {data.sessions.filter((s) => s.status !== "Present").length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by topic…" className="pl-9" />
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sessions</CardTitle>
              <Badge variant="secondary">{data.sessions.length} records</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sessions.map((s) => (
                  <TableRow key={`${s.date}-${s.topic}`}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {s.date}
                    </TableCell>
                    <TableCell className="font-medium">{s.topic}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          s.status === "Present"
                            ? "success"
                            : s.status === "Late"
                            ? "warning"
                            : "destructive"
                        }
                        className="min-w-[76px] justify-center"
                      >
                        {s.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {data.sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                      No session records found for {code}.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

