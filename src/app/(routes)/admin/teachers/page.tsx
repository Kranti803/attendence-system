"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Search,
  Pencil,
  Trash2,
  Filter,
  Download,
  ChevronDown,
} from "lucide-react";

/* ─── Static Data ─── */
const teachers = [
  { id: "TCH001", name: "Dr. Sarah Wilson",   email: "sarah@university.edu",   department: "Computer Science", courses: ["CS101", "CS401"], status: "Active" },
  { id: "TCH002", name: "Prof. James Carter", email: "james@university.edu",   department: "Mathematics",      courses: ["MATH201", "MATH301"], status: "Active" },
  { id: "TCH003", name: "Dr. Emily Chen",     email: "emily@university.edu",   department: "Physics",          courses: ["PHY301"], status: "Active" },
  { id: "TCH004", name: "Prof. Mark Davis",   email: "mark@university.edu",    department: "Engineering",      courses: ["ENG102", "ENG201"], status: "On Leave" },
  { id: "TCH005", name: "Dr. Lisa Park",      email: "lisa@university.edu",    department: "Computer Science", courses: ["CS201"], status: "Active" },
  { id: "TCH006", name: "Prof. Robert Hill",  email: "robert@university.edu",  department: "Mathematics",      courses: ["MATH101"], status: "Active" },
  { id: "TCH007", name: "Dr. Anna Lee",       email: "anna@university.edu",    department: "Physics",          courses: ["PHY101", "PHY201"], status: "Inactive" },
];

export default function TeacherManagementPage() {
  const [open, setOpen] = React.useState(false);
  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Engineering",
    "Biology",
  ];
  const subjects = ["CS101", "CS201", "CS401", "MATH201", "PHY301", "ENG102"];

  return (
    <>
      <TopNavbar title="Teacher Management" userInitials="AU" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
            <p className="text-sm text-muted-foreground">
              Manage faculty members and their course assignments.
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
                  Add Teacher
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
                    <DialogTitle>Add Teacher</DialogTitle>
                    <DialogDescription>
                      Create a new teacher profile. Fields marked{" "}
                      <span className="font-medium text-foreground">*</span> are
                      required.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-5 grid gap-6">
                    {/* Basic Info */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Basic Info
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium text-foreground">
                            Full Name <span className="text-destructive">*</span>
                          </label>
                          <Input placeholder="e.g. Dr. Sarah Wilson" required />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Email <span className="text-destructive">*</span>
                          </label>
                          <Input
                            type="email"
                            placeholder="sarah@university.edu"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Must be unique.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Phone Number{" "}
                            <span className="text-muted-foreground">(optional)</span>
                          </label>
                          <Input placeholder="+1 (234) 567-8900" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Employee ID <span className="text-destructive">*</span>
                          </label>
                          <Input placeholder="TCH-000123" required />
                          <p className="text-xs text-muted-foreground">
                            Must be unique.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Professional Info
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Department <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <select
                              required
                              defaultValue=""
                              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
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
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium text-foreground">
                            Subjects Assigned{" "}
                            <span className="text-muted-foreground">
                              (optional, recommended)
                            </span>
                          </label>
                          <div className="grid gap-2 rounded-xl border border-border bg-background p-3 sm:grid-cols-2">
                            {subjects.map((s) => (
                              <label
                                key={s}
                                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-accent"
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border border-input accent-primary"
                                />
                                <span className="font-mono text-xs text-muted-foreground">
                                  {s}
                                </span>
                              </label>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            You can adjust assignments later from the teacher
                            profile.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Optional (future expansion) */}
                    <div className="rounded-2xl border border-border bg-muted/10 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Optional
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Add more fields later (e.g. office location, joining
                        date, role, notes).
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Create Teacher</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Filters ── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or department…"
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

        {/* ── Teachers Table ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Teachers</CardTitle>
              <Badge variant="secondary">{teachers.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          fallback={teacher.name
                            .replace(/^(Dr\.|Prof\.)\s*/, "")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {teacher.id}
                    </TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.courses.map((c) => (
                          <Badge key={c} variant="secondary">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          teacher.status === "Active"
                            ? "success"
                            : teacher.status === "On Leave"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {teacher.status}
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

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing 1-7 of 56 teachers
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark">
                  1
                </Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
