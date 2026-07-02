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
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  useClassSessions,
  useCreateClassSession,
  useUpdateClassSession,
  useDeleteClassSession,
  useClassSessionsWithFilters,
  useExportClassSessionsExcel,
} from "@/hooks/useClassSession";
import { useSubjects } from "@/hooks/useSubject";
import { ClassSession } from "@/types/classSession";

// ── helpers ──────────────────────────────────────────────────────────────────
const formatTime = (t: string) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
};

const EMPTY_FORM = {
  class_name: "",
  subject: "",
  date: "",
  start_time: "",
  end_time: "",
};

export default function AdminClassesPage() {
  // ── modal state ──────────────────────────────────────────────────────────
  const [open, setOpen] = React.useState(false);
  const [editingSession, setEditingSession] = React.useState<ClassSession | null>(null);

  // ── delete confirm state ─────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = React.useState<ClassSession | null>(null);

  // ── search & filter states ───────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('date');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // ── form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = React.useState(EMPTY_FORM);

  // ── data / mutations ──────────────────────────────────────────────────────
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects();
  const { mutate: createSession, isPending: isCreating } = useCreateClassSession();
  const { mutate: updateSession, isPending: isUpdating } = useUpdateClassSession();
  const { mutate: deleteSession, isPending: isDeleting } = useDeleteClassSession();
  const { mutate: exportExcel, isPending: isExporting } = useExportClassSessionsExcel();
  
  // Use filtered query with backend parameters
  const { data: sessionsData, isLoading } = useClassSessionsWithFilters({
    search: searchTerm || undefined,
    page: currentPage,
    page_size: itemsPerPage,
    ordering: sortBy,
  });

  const sessions = sessionsData?.results || [];
  const totalCount = sessionsData?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const isPending = isCreating || isUpdating;

  const handleExportExcel = () => {
    exportExcel({
      search: searchTerm || undefined,
      ordering: sortBy,
    }, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `classes_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Classes exported successfully');
      },
      onError: (error) => {
        toast.error('Failed to export classes');
        console.error('Export error:', error);
      },
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('date');
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortBy(`-${column}`);
    } else if (sortBy === `-${column}`) {
      setSortBy('date');
    } else {
      setSortBy(column);
    }
    setCurrentPage(1);
  };

  // ── helpers ───────────────────────────────────────────────────────────────
  const resetForm = () => setFormData(EMPTY_FORM);

  const openCreate = () => {
    setEditingSession(null);
    resetForm();
    setOpen(true);
  };

  const openEdit = (session: ClassSession) => {
    setEditingSession(session);
    setFormData({
      class_name: session.class_name,
      subject: session.subject,
      date: session.date,
      start_time: session.start_time.slice(0, 5), // HH:MM
      end_time: session.end_time.slice(0, 5),
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

    const payload = {
      class_name: formData.class_name,
      subject: formData.subject,
      date: formData.date,
      start_time: formData.start_time,
      end_time: formData.end_time,
    };

    if (editingSession) {
      updateSession(
        { id: editingSession.id, payload },
        {
          onSuccess: () => {
            setOpen(false);
            resetForm();
            toast.success("Class session updated successfully");
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createSession(payload, {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          toast.success("Class session created successfully");
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSession(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        toast.success("Class session deleted successfully");
      },
      onError: (err) => toast.error(err.message),
    });
  };

  // ── subject name lookup ───────────────────────────────────────────────────
  const subjectName = (id: string) => {
    const s = subjects.find((s) => s.id === id);
    return s ? `${s.name} (${s.code})` : id;
  };

  // ── filtered list ─────────────────────────────────────────────────────────
  const filtered = sessions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.class_name.toLowerCase().includes(q) ||
      subjectName(s.subject).toLowerCase().includes(q) ||
      s.date.includes(q)
    );
  });

  return (
    <>
      <TopNavbar title="Classes" userInitials="AU" />
      <div className="p-6 space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Classes</h1>
            <p className="text-sm text-muted-foreground">
              Create class sessions, assign subjects, and manage schedules.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportExcel}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              {isExporting ? 'Exporting...' : 'Export'}
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
                  Create Class
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[calc(100svh-2rem)] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSession ? "Edit Class Session" : "Create Class Session"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingSession
                        ? "Update the session details below."
                        : "Define a specific class session where attendance will be taken."}{" "}
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
                            Class Name / Section{" "}
                            <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="class_name"
                            value={formData.class_name}
                            onChange={handleInputChange}
                            placeholder='e.g. "CS101 — Section A"'
                            required
                          />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-medium text-foreground">
                            Subject <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              required
                              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="" disabled>
                                {isLoadingSubjects ? "Loading subjects…" : "Select subject…"}
                              </option>
                              {subjects.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name} ({s.code})
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
                      <p className="text-sm font-semibold text-foreground">Schedule</p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2 sm:col-span-1">
                          <label className="text-sm font-medium text-foreground">
                            Date <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <label className="text-sm font-medium text-foreground">
                            Start Time <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="start_time"
                            type="time"
                            value={formData.start_time}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <label className="text-sm font-medium text-foreground">
                            End Time <span className="text-destructive">*</span>
                          </label>
                          <Input
                            name="end_time"
                            type="time"
                            value={formData.end_time}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
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
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingSession ? "Save Changes" : "Create Session"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Search / Filter ──────────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by class name, subject, or date…"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              {(searchTerm || sortBy !== 'date') && (
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Class Sessions</CardTitle>
              <Badge variant="secondary">{totalCount} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('class_name')}
                  >
                    Class {sortBy === 'class_name' && '↑'} {sortBy === '-class_name' && '↓'}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('subject')}
                  >
                    Subject {sortBy === 'subject' && '↑'} {sortBy === '-subject' && '↓'}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('date')}
                  >
                    Date {sortBy === 'date' && '↑'} {sortBy === '-date' && '↓'}
                  </TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                        <span className="text-muted-foreground">Loading sessions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <p className="text-muted-foreground">No class sessions found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      {/* Class name */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <p className="font-medium text-foreground">
                            {session.class_name}
                          </p>
                        </div>
                      </TableCell>

                      {/* Subject */}
                      <TableCell>
                        <div>
                          <p className="text-sm text-foreground">
                            {subjects.find((s) => s.id === session.subject)?.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {subjects.find((s) => s.id === session.subject)?.code ?? ""}
                          </p>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>

                      {/* Time */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(session.start_time)} — {formatTime(session.end_time)}
                        </div>
                      </TableCell>

                      {/* Teacher */}
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-foreground">{session.teacher_name || "—"}</p>
                          {session.teacher_email && (
                            <p className="text-xs text-muted-foreground">{session.teacher_email}</p>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(session)}
                          >
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDeleteTarget(session)}
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
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
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
            <DialogTitle>Delete Class Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.class_name}
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
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
