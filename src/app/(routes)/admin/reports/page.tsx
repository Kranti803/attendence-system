"use client";

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
import {
  Calendar,
  Download,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  Users,
} from "lucide-react";

const reports = [
  {
    date: "2026-03-17",
    department: "Computer Science",
    class: "CS101 — Section A",
    teacher: "Dr. Sarah Wilson",
    total: 36,
    present: 32,
    late: 2,
    absent: 2,
    rate: 88.9,
  },
  {
    date: "2026-03-16",
    department: "Mathematics",
    class: "MATH201 — Section A",
    teacher: "Prof. Robert Hill",
    total: 24,
    present: 21,
    late: 1,
    absent: 2,
    rate: 87.5,
  },
  {
    date: "2026-03-16",
    department: "Physics",
    class: "PHY301 — Section B",
    teacher: "Dr. Emily Chen",
    total: 22,
    present: 17,
    late: 0,
    absent: 5,
    rate: 77.3,
  },
];

export default function AdminReportsPage() {
  return (
    <>
      <TopNavbar title="Reports" userInitials="AU" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Institution-wide attendance reports with export options.
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

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" defaultValue="2026-03-13" className="pl-9" />
              </div>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" defaultValue="2026-03-17" className="pl-9" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Department
                </Button>
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Class
                </Button>
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Teacher
                </Button>
                <Button size="default">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Average Attendance</p>
              <p className="mt-1 text-3xl font-bold text-primary">84.6%</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last 7 days across selected filters
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <div className="mt-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-3xl font-bold text-foreground">1,234</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Enrolled institution-wide
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Teachers</p>
              <div className="mt-1 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <p className="text-3xl font-bold text-foreground">56</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Active instructors
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sessions</CardTitle>
              <Badge variant="secondary">{reports.length} records</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Late</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                  <TableHead className="text-right">Export</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={`${r.date}-${r.class}`}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {r.date}
                    </TableCell>
                    <TableCell>{r.department}</TableCell>
                    <TableCell className="font-medium">{r.class}</TableCell>
                    <TableCell>{r.teacher}</TableCell>
                    <TableCell className="text-center text-emerald-600 font-medium">
                      {r.present}/{r.total}
                    </TableCell>
                    <TableCell className="text-center text-amber-600 font-medium">
                      {r.late}
                    </TableCell>
                    <TableCell className="text-center text-red-600 font-medium">
                      {r.absent}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          r.rate >= 90
                            ? "success"
                            : r.rate >= 80
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {r.rate.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
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

