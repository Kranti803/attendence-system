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
  Loader2,
} from "lucide-react";

import {
  useCreateSubject,
  useSubjects,
  useUpdateSubject,
  useDeleteSubject,
} from "@/hooks/useSubject";
import { useTeachers } from "@/hooks/useTeacher";
import { Subject } from "@/types/subject";

const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Engineering",
  "Biology",
];
const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const EMPTY_FORM = {
  name: "",
  code: "",
  department: "",
  semester: "",
  teacher: "",
};

export default function AdminSubjectsPage() {
  // ── modal state ──────────────────────────────────────────────────────────
  const [open, setOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null);

  // ── delete confirm state ─────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = React.useState<Subject | null>(null);

  // ── search ───────────────────────────────────────────────────────────────
  const [search, setSearch] = React.useState("");

  // ── form ─────────────────────────────────────────────────────────────────
  const [formData, setFormData] = React.useState(EMPTY_FORM);

  // ── data / mutations ─────────────────────────────────────────────────────
  const { data: subjects = [], isLoading } = useSubjects();
  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachers();
  const { mutate: createSubject, isPending: isCreating } = useCreateSubject();
  const { mutate: updateSubject, isPending: isUpdating } = useUpdateSubject();
  const { mutate: deleteSubject, isPending: isDeleting } = useDeleteSubject();

  const isPending = isCreating || isUpdating;

  // ── helpers ───────────────────────────────────────────────────────────────
  const resetForm = () => setFormData(EMPTY_FORM);

  const openCreate = () => {
    setEditingSubject(null);
    resetForm();
    setOpen(true);
  };

  const openEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      department: subject.department,
      semester: subject.semester?.toString() ?? "",
      teacher: typeof subject.teacher === "string" ? subject.teacher : "",
    });
    setOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      code: formData.code,
      department: formData.department,
      semester: formData.semester ? parseInt(formData.semester, 10) : 1,
      teacher: formData.teacher || null,
    };

    if (editingSubject) {
      updateSubject(
        { id: editingSubject.id, payload },
        {
          onSuccess: () => {
            setOpen(false);
            resetForm();
          },
        }
      );
    } else {
      createSubject(payload, {
        onSuccess: () => {
          setOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSubject(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  // ── filtered list ─────────────────────────────────────────────────────────
  const filtered = subjects.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  // ── teacher name lookup ───────────────────────────────────────────────────
  const teacherName = (id?: string | null) => {
    if (!id) return null;
    const t = teachers.find((t) => t.id.toString() === id);
    return t ? `${t.first_name} ${t.last_name}` : null;
  };

  return (
    <>
      <TopNavbar title="Subjects" userInitials="AU" />
      <div className="p-6 space-y-6">

        {/* ── Header ──────────────────────────────────────────────────── */}
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

            {/* ── Create / Edit Dialog ────────────────────────────────── */}
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  Add Subject
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[calc(100svh-2rem)] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSubject ? "Edit Subject" : "Add Subject"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingSubject
                        ? "Update the subject details below."
                        : "Create a subject and optionally assign a teacher."}{" "}
                      Fields marked <span className="font-medium text-foreground">*</span> are required.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-5 grid gap-6">
                    {/* Core Info */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">Core Info</p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium text-foreground">
                            Subject Name <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Linear Algebra"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Subject Code <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            placeholder="e.g. MATH201"
                            required
                          />
                          <p className="text-xs text-muted-foreground">Must be unique.</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">Academic Info</p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Department <span className="text-destructive">*</span>
                          </label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            required
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="" disabled>Select department…</option>
                            {DEPARTMENTS.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Semester <span className="text-destructive">*</span>
                          </label>
                          <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleInputChange}
                            required
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="" disabled>Select…</option>
                            {SEMESTERS.map((s) => (
                              <option key={s} value={s}>Semester {s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Assignment */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">Assignment</p>
                      <div className="mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Assign Teacher{" "}
                            <span className="text-muted-foreground">(optional)</span>
                          </label>
                          <select
                            name="teacher"
                            value={formData.teacher}
                            onChange={handleInputChange}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="">No teacher assigned</option>
                            {isLoadingTeachers ? (
                              <option disabled>Loading teachers...</option>
                            ) : (
                              teachers.map((t) => (
                                <option key={t.id.toString()} value={t.id.toString()}>
                                  {t.first_name} {t.last_name}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingSubject ? "Save Changes" : "Create Subject"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Search / Filter ──────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by code, name, or department…"
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Department
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Table ────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Subjects</CardTitle>
              <Badge variant="secondary">{filtered.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-center">Semester</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                        <span className="text-muted-foreground">Loading subjects...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <p className="text-muted-foreground">No subjects found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{s.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{s.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{s.department}</TableCell>
                      <TableCell className="text-center">
                        {s.semester ? `Sem ${s.semester}` : "—"}
                      </TableCell>
                      <TableCell>
                        {teacherName(typeof s.teacher === "string" ? s.teacher : null) ?? (
                          <span className="text-muted-foreground text-xs">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(s)}
                          >
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDeleteTarget(s)}
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
          </CardContent>
        </Card>
      </div>

      {/* ── Delete Confirmation Dialog ──────────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Subject</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{deleteTarget?.name}</span>{" "}
              ({deleteTarget?.code})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
