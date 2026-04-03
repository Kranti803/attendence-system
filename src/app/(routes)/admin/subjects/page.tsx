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
  BookOpen,
  Download,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const subjects = [
  {
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    credits: 3,
    semester: "1",
    status: "Active",
  },
  {
    code: "MATH201",
    name: "Linear Algebra",
    department: "Mathematics",
    credits: 4,
    semester: "3",
    status: "Active",
  },
  {
    code: "PHY301",
    name: "Quantum Physics",
    department: "Physics",
    credits: 4,
    semester: "5",
    status: "Active",
  },
  {
    code: "ENG102",
    name: "Technical Writing",
    department: "Engineering",
    credits: 2,
    semester: "2",
    status: "Inactive",
  },
];

export default function AdminSubjectsPage() {
  const [open, setOpen] = React.useState(false);
  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Engineering",
    "Biology",
  ];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const teachers = [
    "Dr. Sarah Wilson",
    "Prof. James Carter",
    "Dr. Emily Chen",
    "Prof. Robert Hill",
  ];

  return (
    <>
      <TopNavbar title="Subjects" userInitials="AU" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage subjects offered by your institution.
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
                  Add Subject
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
                    <DialogTitle>Add Subject</DialogTitle>
                    <DialogDescription>
                      Create a subject and optionally assign a teacher. Fields
                      marked{" "}
                      <span className="font-medium text-foreground">*</span> are
                      required.
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
                            Subject Name{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input placeholder="e.g. Linear Algebra" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Subject Code{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input placeholder="e.g. MATH201" required />
                          <p className="text-xs text-muted-foreground">
                            Must be unique.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Academic Info
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Department{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <select
                            required
                            defaultValue=""
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="" disabled>
                              Select department…
                            </option>
                            {departments.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Semester / Year{" "}
                            <span className="text-muted-foreground">
                              (optional)
                            </span>
                          </label>
                          <select
                            defaultValue=""
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="" disabled>
                              Select…
                            </option>
                            {semesters.map((s) => (
                              <option key={s} value={s}>
                                Semester {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Assignment */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Assignment
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium text-foreground">
                            Assigned Teacher{" "}
                            <span className="text-muted-foreground">
                              (optional, recommended)
                            </span>
                          </label>
                          <select
                            defaultValue=""
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
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
                        </div>
                      </div>
                    </div>

                    {/* Optional */}
                    <div className="rounded-2xl border border-border bg-muted/10 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Optional
                      </p>
                      <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Description{" "}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Short description about the subject…"
                          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Create Subject</Button>
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
                  placeholder="Search by code, name, or department…"
                  className="pl-9"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Department
                </Button>
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Subjects</CardTitle>
              <Badge variant="secondary">{subjects.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead className="text-center">Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((s) => (
                  <TableRow key={s.code}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <BookOpen className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {s.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {s.code}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{s.department}</TableCell>
                    <TableCell className="text-center">{s.credits}</TableCell>
                    <TableCell className="text-center">{s.semester}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          s.status === "Active" ? "success" : "secondary"
                        }
                      >
                        {s.status}
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
