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
  ChevronDown,
  Download,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  BookUser,
} from "lucide-react";
import { toast } from "sonner";

import {
  useEnrollments,
  useCreateEnrollment,
  useUpdateEnrollment,
  useDeleteEnrollment,
  useEnrollmentsWithFilters,
  useExportEnrollmentsExcel,
} from "@/hooks/useEnrollment";
import { useStudents } from "@/hooks/useStudent";
import { useSubjects } from "@/hooks/useSubject";
import { Enrollment } from "@/types/enrollment";

const EMPTY_FORM = {
  student: "",
  subject: "",
};

export default function EnrollmentsPage() {
  const [open, setOpen] = React.useState(false);
  const [editingEnrollment, setEditingEnrollment] = React.useState<Enrollment | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Enrollment | null>(null);
  
  // Filter & Search States
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('student');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = React.useState(EMPTY_FORM);

  const { data: students = [], isLoading: isLoadingStudents } = useStudents();
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects();

  const { mutate: createEnrollment, isPending: isCreating } = useCreateEnrollment();
  const { mutate: updateEnrollment, isPending: isUpdating } = useUpdateEnrollment();
  const { mutate: deleteEnrollment, isPending: isDeleting } = useDeleteEnrollment();
  const { mutate: exportExcel, isPending: isExporting } = useExportEnrollmentsExcel();
  
  // Use filtered query with backend parameters
  const { data: enrollmentsData, isLoading } = useEnrollmentsWithFilters({
    search: searchTerm || undefined,
    page: currentPage,
    page_size: itemsPerPage,
    ordering: sortBy,
  });

  const enrollments = enrollmentsData?.results || [];
  const totalCount = enrollmentsData?.count || 0;
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
        link.download = `enrollments_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Enrollments exported successfully');
      },
      onError: (error) => {
        toast.error('Failed to export enrollments');
        console.error('Export error:', error);
      },
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('student');
    setCurrentPage(1);
  };

  const resetForm = () => setFormData(EMPTY_FORM);

  const openCreate = () => {
    setEditingEnrollment(null);
    resetForm();
    setOpen(true);
  };

  const openEdit = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    setFormData({
      student: enrollment.student,
      subject: enrollment.subject,
    });
    setOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      student: formData.student,
      subject: formData.subject,
    };

    if (editingEnrollment) {
      updateEnrollment(
        { id: editingEnrollment.id, payload },
        {
          onSuccess: () => {
            setOpen(false);
            resetForm();
            toast.success("Enrollment updated successfully");
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createEnrollment(payload, {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          toast.success("Enrollment created successfully");
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteEnrollment(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        toast.success("Enrollment deleted successfully");
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const studentName = (enrollment: Enrollment) => {
    // Use backend-returned student_name if available, fallback to old method
    if (enrollment.student_name) {
      return `${enrollment.student_name} (${enrollment.student_roll_number || 'N/A'})`;
    }
    const s = students.find((st) => st.id === enrollment.student);
    return s ? `${s.first_name} ${s.last_name} (${s.roll_number || s.id.substring(0, 4)})` : enrollment.student;
  };

  const subjectName = (enrollment: Enrollment) => {
    // Use backend-returned subject_name if available, fallback to old method
    if (enrollment.subject_name) {
      return `${enrollment.subject_name} (${enrollment.subject_code || 'N/A'})`;
    }
    const s = subjects.find((st) => st.id === enrollment.subject);
    return s ? `${s.name} (${s.code})` : enrollment.subject;
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortBy(`-${column}`);
    } else if (sortBy === `-${column}`) {
      setSortBy('student');
    } else {
      setSortBy(column);
    }
    setCurrentPage(1);
  };

  return (
    <>
      <TopNavbar title="Enrollments" userInitials="AU" />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Enrollments</h1>
            <p className="text-sm text-muted-foreground">
              Manage enrollments of students in various subjects.
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
                  Enroll Student
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingEnrollment ? "Edit Enrollment" : "Create Enrollment"}
                    </DialogTitle>
                    <DialogDescription>
                      Enroll a student into a specific subject.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Student <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="student"
                          value={formData.student}
                          onChange={handleInputChange}
                          required
                          className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="" disabled>
                            {isLoadingStudents ? "Loading students…" : "Select student…"}
                          </option>
                          {students.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.first_name} {s.last_name} - {s.roll_number}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
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

                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingEnrollment ? "Save Changes" : "Confirm Enrollment"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, roll number, or subject…"
                  className="pl-9 w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              {(searchTerm || sortBy !== 'student') && (
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Enrollment List</CardTitle>
              <Badge variant="secondary">{totalCount} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('student')}
                  >
                    Student {sortBy === 'student' && '↑'} {sortBy === '-student' && '↓'}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('subject')}
                  >
                    Subject {sortBy === 'subject' && '↑'} {sortBy === '-subject' && '↓'}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('created_at')}
                  >
                    Enrolled At {sortBy === 'created_at' && '↑'} {sortBy === '-created_at' && '↓'}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                        <span className="text-muted-foreground">Loading enrollments...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <p className="text-muted-foreground">No enrollments found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrol) => (
                    <TableRow key={enrol.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookUser className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {studentName(enrol)}
                            </p>
                            {enrol.student_department && (
                              <p className="text-xs text-muted-foreground">
                                {enrol.student_department}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm text-foreground">
                            {subjectName(enrol)}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(enrol.created_at || Date.now()).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(enrol)}
                          >
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDeleteTarget(enrol)}
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

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Enrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this enrollment? This action cannot be undone.
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
