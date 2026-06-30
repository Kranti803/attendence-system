"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import {
  useCreateTeacher,
  useTeachers,
  useUpdateTeacher,
  useDeleteTeacher,
} from "@/hooks/useTeacher";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Teacher } from "@/types/teacher";

const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Engineering",
  "Biology",
];

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone_no: "",
  employee_id: "",
  address: "",
  department: "",
  password: "",
};

export default function TeacherManagementPage() {
  // ── modal state ──────────────────────────────────────────────────────────
  const [open, setOpen] = React.useState(false);
  const [editingTeacher, setEditingTeacher] = React.useState<Teacher | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  // ── delete confirm state ─────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = React.useState<Teacher | null>(null);

  // ── form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = React.useState(EMPTY_FORM);

  // ── data / mutations ──────────────────────────────────────────────────────
  const { data: teachers = [], isLoading } = useTeachers();
  const { mutate: createTeacher, isPending: isCreating } = useCreateTeacher();
  const { mutate: updateTeacher, isPending: isUpdating } = useUpdateTeacher();
  const { mutate: deleteTeacher, isPending: isDeleting } = useDeleteTeacher();

  const isPending = isCreating || isUpdating;

  // ── helpers ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setShowPassword(false);
  };

  const openCreate = () => {
    setEditingTeacher(null);
    resetForm();
    setOpen(true);
  };

  const openEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      first_name: teacher.first_name ?? "",
      last_name: teacher.last_name ?? "",
      email: teacher.email ?? "",
      phone_no: teacher.phone_no ?? "",
      employee_id: teacher.employee_id ?? "",
      address: teacher.address ?? "",
      department: teacher.department ?? "",
      password: "", // never pre-fill password
    });
    setOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTeacher) {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_no: formData.phone_no || null,
        employee_id: formData.employee_id,
        address: formData.address || null,
        department: formData.department || null,
      };
      updateTeacher(
        { id: editingTeacher.id.toString(), payload },
        {
          onSuccess: () => {
            setOpen(false);
            resetForm();
            toast.success("Teacher updated successfully");
          },
          onError: (error) => toast.error(error.message),
        }
      );
    } else {
      createTeacher(
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_no: formData.phone_no,
          employee_id: formData.employee_id,
          address: formData.address,
          department: formData.department,
          password: formData.password,
        },
        {
          onSuccess: () => {
            setOpen(false);
            resetForm();
            toast.success("Teacher created successfully");
          },
          onError: (error) => toast.error(error.message),
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTeacher(deleteTarget.id.toString(), {
      onSuccess: () => {
        setDeleteTarget(null);
        toast.success("Teacher deleted successfully");
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <>
      <TopNavbar title="Teacher Management" userInitials="AU" />
      <div className="p-6 space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
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

            {/* ── Create / Edit Dialog ───────────────────────────────────── */}
            <Dialog
              open={open}
              onOpenChange={(v) => {
                setOpen(v);
                if (!v) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm" onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  Add Teacher
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[calc(100svh-2rem)] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingTeacher ? "Edit Teacher" : "Add Teacher"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTeacher
                        ? "Update the teacher's profile details below."
                        : "Create a new teacher profile."}{" "}
                      Fields marked{" "}
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
                            value={formData.first_name}
                            onChange={handleInputChange}
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
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="e.g. Wilson"
                            required
                          />
                        </div>

                        {/* Email — read-only when editing */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Email <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="sarah@university.edu"
                            required={!editingTeacher}
                            disabled={!!editingTeacher}
                            className={editingTeacher ? "opacity-60 cursor-not-allowed" : ""}
                          />
                          {editingTeacher && (
                            <p className="text-xs text-muted-foreground">
                              Email cannot be changed after creation.
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Phone Number
                          </label>
                          <Input
                            name="phone_no"
                            value={formData.phone_no}
                            onChange={handleInputChange}
                            placeholder="+1 (234) 567-8900"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Employee ID{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleInputChange}
                            placeholder="TCH-000123"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Must be unique.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Address
                          </label>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="123 University Ave"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional & Security Info */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Professional{!editingTeacher && " & Security"} Info
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
                              value={formData.department}
                              onChange={handleInputChange}
                              required
                              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="" disabled>
                                Select department…
                              </option>
                              {DEPARTMENTS.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        {/* Password — only shown when creating */}
                        {!editingTeacher && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                              Password{" "}
                              <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                              <Input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
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
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      {isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingTeacher ? "Save Changes" : "Create Teacher"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Filters ────────────────────────────────────────────────────── */}
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

        {/* ── Teachers Table ──────────────────────────────────────────────── */}
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
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                        <span className="text-muted-foreground">
                          Loading teachers...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : teachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <p className="text-muted-foreground">
                        No teachers found.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            fallback={`${teacher.first_name} ${teacher.last_name}`
                              .replace(/^(Dr\.|Prof\.)\s*/, "")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-foreground">
                              {teacher.first_name} {teacher.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {teacher.email}
                            </p>
                            {teacher.phone_no && (
                              <p className="text-xs text-muted-foreground">
                                {teacher.phone_no}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {teacher.employee_id || teacher.id}
                      </TableCell>
                      <TableCell>{teacher.department || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {teacher.address || (
                          <span className="text-xs italic">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            teacher.status === "Active"
                              ? "success"
                              : teacher.status === "On Leave"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {teacher.status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(teacher)}
                          >
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDeleteTarget(teacher)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {teachers.length} teacher{teachers.length !== 1 ? "s" : ""}
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
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Delete Confirmation Dialog ──────────────────────────────────────── */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Teacher</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.first_name} {deleteTarget?.last_name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
