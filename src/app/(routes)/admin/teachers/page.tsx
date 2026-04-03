"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { useCreateTeacher } from "@/hooks/useTeacher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Static Data ─── */
const teachers = [
  {
    id: "TCH001",
    name: "Dr. Sarah Wilson",
    email: "sarah@university.edu",
    department: "Computer Science",
    courses: ["CS101", "CS401"],
    status: "Active",
  },
  {
    id: "TCH002",
    name: "Prof. James Carter",
    email: "james@university.edu",
    department: "Mathematics",
    courses: ["MATH201", "MATH301"],
    status: "Active",
  },
  {
    id: "TCH003",
    name: "Dr. Emily Chen",
    email: "emily@university.edu",
    department: "Physics",
    courses: ["PHY301"],
    status: "Active",
  },
  {
    id: "TCH004",
    name: "Prof. Mark Davis",
    email: "mark@university.edu",
    department: "Engineering",
    courses: ["ENG102", "ENG201"],
    status: "On Leave",
  },
  {
    id: "TCH005",
    name: "Dr. Lisa Park",
    email: "lisa@university.edu",
    department: "Computer Science",
    courses: ["CS201"],
    status: "Active",
  },
  {
    id: "TCH006",
    name: "Prof. Robert Hill",
    email: "robert@university.edu",
    department: "Mathematics",
    courses: ["MATH101"],
    status: "Active",
  },
  {
    id: "TCH007",
    name: "Dr. Anna Lee",
    email: "anna@university.edu",
    department: "Physics",
    courses: ["PHY101", "PHY201"],
    status: "Inactive",
  },
];

export default function TeacherManagementPage() {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutate: createTeacher, isPending } = useCreateTeacher();
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
                    const formData = new FormData(e.currentTarget);
                    const payload = {
                      first_name: formData.get("first_name") as string,
                      last_name: formData.get("last_name") as string,
                      email: formData.get("email") as string,
                      phone_no: formData.get("phone_no") as string,
                      employee_id: formData.get("employee_id") as string,
                      address: formData.get("address") as string,
                      department: formData.get("department") as string,
                      password: formData.get("password") as string,
                    };
                    createTeacher(payload, {
                      onSuccess: () => {
                        setOpen(false);
                        toast.success("Teacher created successfully");
                      },
                      onError: (error) => {
                        toast.error(error.message);
                      },
                    });
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
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            First Name{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="first_name"
                            placeholder="e.g. Sarah"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Last Name{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="last_name"
                            placeholder="e.g. Wilson"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Email <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="email"
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
                            <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="phone_no"
                            placeholder="+1 (234) 567-8900"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Employee ID{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="employee_id"
                            placeholder="TCH-000123"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Must be unique.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Address <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="address"
                            placeholder="123 University Ave"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional & Security Info */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Professional & Security Info
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Department{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="department"
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

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Password <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              required
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
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
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Creating..." : "Create Teacher"}
                    </Button>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary-dark"
                >
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
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
