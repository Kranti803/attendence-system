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
import {
  Download,
  Filter,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";

/* ─── Static Data ─── */
const reports = [
  { date: "2026-03-17", class: "CS101", totalStudents: 36, present: 32, absent: 4, rate: "88.9%" },
  { date: "2026-03-16", class: "CS401", totalStudents: 28, present: 26, absent: 2, rate: "92.9%" },
  { date: "2026-03-16", class: "CS101", totalStudents: 36, present: 34, absent: 2, rate: "94.4%" },
  { date: "2026-03-15", class: "CS401", totalStudents: 28, present: 25, absent: 3, rate: "89.3%" },
  { date: "2026-03-15", class: "CS101", totalStudents: 36, present: 33, absent: 3, rate: "91.7%" },
  { date: "2026-03-14", class: "CS401", totalStudents: 28, present: 27, absent: 1, rate: "96.4%" },
  { date: "2026-03-14", class: "CS101", totalStudents: 36, present: 35, absent: 1, rate: "97.2%" },
  { date: "2026-03-13", class: "CS101", totalStudents: 36, present: 30, absent: 6, rate: "83.3%" },
];

export default function TeacherReportsPage() {
  return (
    <>
      <TopNavbar title="Reports" userInitials="SW" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Attendance Reports
            </h1>
            <p className="text-sm text-muted-foreground">
              View and export detailed attendance reports for your classes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* ── Filters ── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  defaultValue="2026-03-13"
                  className="pl-9"
                />
              </div>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  defaultValue="2026-03-17"
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="default">
                <Filter className="h-4 w-4" />
                Class: All
              </Button>
              <Button size="default">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Summary Cards ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Average Rate</p>
              <p className="text-3xl font-bold text-primary mt-1">91.8%</p>
              <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-3xl font-bold text-foreground mt-1">8</p>
              <p className="text-xs text-muted-foreground mt-1">In selected period</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">Best Attendance</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">97.2%</p>
              <p className="text-xs text-muted-foreground mt-1">CS101 — March 14</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Reports Table ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed Reports</CardTitle>
              <Badge variant="secondary">{reports.length} sessions</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r, i) => {
                  const rateNum = parseFloat(r.rate);
                  return (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {r.date}
                      </TableCell>
                      <TableCell className="font-medium">{r.class}</TableCell>
                      <TableCell className="text-center">{r.totalStudents}</TableCell>
                      <TableCell className="text-center text-emerald-600 font-medium">
                        {r.present}
                      </TableCell>
                      <TableCell className="text-center text-red-600 font-medium">
                        {r.absent}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            rateNum >= 90
                              ? "success"
                              : rateNum >= 80
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {r.rate}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
