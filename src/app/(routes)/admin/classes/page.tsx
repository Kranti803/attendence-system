"use client";

import React from "react";
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
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Download,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  ChevronDown,
} from "lucide-react";

const classes = [
  {
    id: "CLS-CS101-A",
    name: "CS101 — Section A",
    subject: "CS101",
    teacher: { name: "Dr. Sarah Wilson", initials: "SW" },
    room: "Room 201",
    schedule: "Mon/Wed/Fri · 09:00",
    students: 36,
    status: "Active",
  },
  {
    id: "CLS-CS401-B",
    name: "CS401 — Section B",
    subject: "CS401",
    teacher: { name: "Prof. James Carter", initials: "JC" },
    room: "Room 305",
    schedule: "Tue/Thu · 11:00",
    students: 28,
    status: "Active",
  },
  {
    id: "CLS-MATH201-A",
    name: "MATH201 — Section A",
    subject: "MATH201",
    teacher: { name: "Prof. Robert Hill", initials: "RH" },
    room: "Room 110",
    schedule: "Mon/Wed · 14:00",
    students: 24,
    status: "Draft",
  },
];

export default function AdminClassesPage() {
  const [open, setOpen] = React.useState(false);
  const subjects = ["CS101", "CS201", "CS401", "MATH201", "PHY301", "ENG102"];
  const teachers = [
    "Dr. Sarah Wilson",
    "Prof. James Carter",
    "Dr. Emily Chen",
    "Prof. Robert Hill",
  ];

  return (
    <>
      <TopNavbar title="Classes" userInitials="AU" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Classes</h1>
            <p className="text-sm text-muted-foreground">
              Create classes, assign teachers, and manage schedules.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[calc(100svh-2rem)] overflow-y-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Create Class (Session)</DialogTitle>
                    <DialogDescription>
                      Define a specific class session where attendance will be
                      taken.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-5 grid gap-6">
                    {/* Core Info */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Core Info
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium text-foreground">
                            Class Name / Section{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input placeholder='e.g. "Section A"' required />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Subject <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <select
                              required
                              defaultValue=""
                              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="" disabled>
                                Select subject…
                              </option>
                              {subjects.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Teacher <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <select
                              required
                              defaultValue=""
                              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="" disabled>
                                Select teacher…
                              </option>
                              {teachers.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Schedule Info
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2 sm:col-span-1">
                          <label className="text-sm font-medium text-foreground">
                            Date <span className="text-destructive">*</span>
                          </label>
                          <Input type="date" required />
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <label className="text-sm font-medium text-foreground">
                            Start Time{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input type="time" required />
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <label className="text-sm font-medium text-foreground">
                            End Time{" "}
                            <span className="text-muted-foreground">
                              (optional)
                            </span>
                          </label>
                          <Input type="time" />
                        </div>
                      </div>
                    </div>

                    {/* Optional (Advanced) */}
                    <div className="rounded-2xl border border-border bg-muted/10 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Optional (Advanced)
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Room / Location{" "}
                            <span className="text-muted-foreground">
                              (optional)
                            </span>
                          </label>
                          <Input placeholder="e.g. Room 201" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Session Type{" "}
                            <span className="text-muted-foreground">
                              (optional)
                            </span>
                          </label>
                          <div className="relative">
                            <select
                              defaultValue=""
                              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="" disabled>
                                Select type…
                              </option>
                              <option value="Lecture">Lecture</option>
                              <option value="Lab">Lab</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Create Session</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by class, subject, or room…"
                  className="pl-9"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Subject
                </Button>
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Teacher
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Classes</CardTitle>
              <Badge variant="secondary">{classes.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-mono">{c.subject}</span> ·{" "}
                          {c.room}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar fallback={c.teacher.initials} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {c.teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {c.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {c.schedule}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {c.students}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.status === "Active"
                            ? "success"
                            : c.status === "Draft"
                              ? "secondary"
                              : "warning"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
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
