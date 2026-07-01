"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
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
  ImagePlus,
  Camera,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useCreateStudent, useStudents, useUpdateStudent, useDeleteStudent } from "@/hooks/useStudent";
import { Student } from "@/types/student";
import { toast } from "sonner";

const getErrorMessage = (err: any, fallback: string = "An error occurred") => {
  const errorData = err?.response?.data?.error;
  if (!errorData) {
    return err?.response?.data?.message || err?.message || fallback;
  }
  if (typeof errorData === "string") {
    return errorData;
  }
  if (typeof errorData === "object") {
    return Object.entries(errorData)
      .map(([key, val]) => {
        const fieldName = key.replace(/_/g, " ");
        const messages = Array.isArray(val) ? val.join(", ") : String(val);
        return `${fieldName}: ${messages}`;
      })
      .join(" | ");
  }
  return fallback;
};

export default function StudentManagementPage() {
  const [open, setOpen] = React.useState(false);
  const [editingStudentId, setEditingStudentId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Student | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Engineering",
    "Biology",
  ];

  const [formData, setFormData] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_no: "",
    address: "",
    roll_number: "",
    department: "",
    year: "",
    semester: "",
  });

  const [capturedPhotos, setCapturedPhotos] = React.useState<File[]>([]);
  const [photoMode, setPhotoMode] = React.useState<"upload" | "camera">("upload");
  const [cameraFacingMode, setCameraFacingMode] = React.useState<"user" | "environment">("user");
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [isCapturing, setIsCapturing] = React.useState(false);

  const { mutate: addStudent, isPending: isCreating } = useCreateStudent();
  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const { mutate: deleteStudent } = useDeleteStudent();
  const { data: students = [], isLoading: isLoadingStudents } = useStudents();
  
  const isPending = isCreating || isUpdating;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: cameraFacingMode, width: 1280, height: 720 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleSwitchPhotoMode = (mode: "upload" | "camera") => {
    stopCamera();
    setPhotoMode(mode);
  };

  const captureImage = async () => {
    if (!videoRef.current || !isCameraOpen || capturedPhotos.length >= 5) return;
    setIsCapturing(true);

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");

    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.7)
      );
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedPhotos((prev) => {
          const newPhotos = [...prev, file].slice(0, 5);
          if (newPhotos.length === 5) {
            stopCamera();
          }
          return newPhotos;
        });
      }
    }
    
    setIsCapturing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStudentId) {
      updateStudent(
        {
          id: editingStudentId,
          payload: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_no: formData.phone_no,
            address: formData.address,
            roll_number: formData.roll_number,
            department: formData.department,
            year: parseInt(formData.year, 10),
            semester: parseInt(formData.semester, 10),
          },
        },
        {
          onSuccess: () => {
            setOpen(false);
            resetForm();
            toast.success("Student updated successfully");
          },
          onError: (err) => toast.error(getErrorMessage(err, "Failed to update student")),
        }
      );
      return;
    }

    if (capturedPhotos.length !== 5) {
      alert("Please capture or upload exactly 5 images.");
      return;
    }

    addStudent(
      {
        ...formData,
        year: parseInt(formData.year, 10),
        semester: parseInt(formData.semester, 10),
        images: capturedPhotos,
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          toast.success("Student created successfully");
        },
        onError: (err) => toast.error(getErrorMessage(err, "Failed to create student")),
      }
    );
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_no: "",
      address: "",
      roll_number: "",
      department: "",
      year: "",
      semester: "",
    });
    setCapturedPhotos([]);
    setEditingStudentId(null);
    stopCamera();
  };

  const handleEdit = (student: any) => {
    setFormData({
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      email: student.email || "",
      password: "", // do not populate password
      phone_no: student.phone_no || "",
      address: student.address || "",
      roll_number: student.roll_number || "",
      department: student.department || "",
      year: student.year?.toString() || "",
      semester: student.semester?.toString() || "",
    });
    setEditingStudentId(student.id);
    setOpen(true);
  };

  const handleDelete = (student: Student) => {
    setDeleteTarget(student);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteStudent(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        toast.success("Student deleted successfully");
      },
      onError: (err) => toast.error(getErrorMessage(err, "Failed to delete student")),
    });
  };

  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <>
      <TopNavbar title="Student Management" userInitials="AU" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-sm text-muted-foreground">
              Manage all enrolled students in the system.
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
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[calc(100svh-2rem)] overflow-y-auto">
                <form
                  onSubmit={handleSubmit}
                >
                  <DialogHeader>
                    <DialogTitle>{editingStudentId ? "Edit Student" : "Add Student"}</DialogTitle>
                    <DialogDescription>
                      {editingStudentId
                        ? "Update student details."
                        : "Register a student and collect face images for recognition. Upload at least 3–5 images."}
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
                            First Name <span className="text-destructive">*</span>
                          </label>
                          <Input name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="e.g. Alice" required />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Last Name <span className="text-destructive">*</span>
                          </label>
                          <Input name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="e.g. Johnson" required />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Roll Number <span className="text-destructive">*</span>
                          </label>
                          <Input name="roll_number" value={formData.roll_number} onChange={handleInputChange} placeholder="e.g. STU-2026-001" required />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Phone Number
                          </label>
                          <Input name="phone_no" value={formData.phone_no} onChange={handleInputChange} placeholder="+1 (234) 567-8900" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Address
                          </label>
                          <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Email <span className="text-destructive">*</span>
                          </label>
                          <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="alice@university.edu" required disabled={!!editingStudentId} />
                        </div>

                        {!editingStudentId && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                              Password <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                              <Input 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                value={formData.password} 
                                onChange={handleInputChange} 
                                placeholder="Min 8 chars, uppercase, digit, special" 
                                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                                title="Password must be at least 8 characters with uppercase, lowercase, digit, and special character (@$!%*?&)"
                                required={!editingStudentId} 
                                className="pr-10"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        )}
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
                            Department <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              required
                              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="" disabled>Select department…</option>
                              {departments.map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Year <span className="text-destructive">*</span>
                          </label>
                          <Input name="year" type="number" value={formData.year} onChange={handleInputChange} placeholder="e.g. 2026" required />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Semester <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="semester"
                              value={formData.semester}
                              onChange={handleInputChange}
                              required
                              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="" disabled>Select semester…</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                <option key={s} value={s}>{s}{s === 1 ? 'st' : s === 2 ? 'nd' : s === 3 ? 'rd' : 'th'} Semester</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Face Recognition Data */}
                    {!editingStudentId && (
                      <div className="rounded-2xl border border-border bg-muted/20 p-4">
                        <p className="text-sm font-semibold text-foreground">
                          Face Recognition Data{" "}
                          <span className="text-destructive">(required)</span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Provide at least 3–5 clear images with different angles
                          and lighting.
                        </p>

                        {/* Toggle Buttons */}
                        <div className="mt-4 flex gap-2 border-b border-border">
                          <button
                            type="button"
                            onClick={() => handleSwitchPhotoMode("upload")}
                            className={`pb-2 px-1 text-sm font-medium transition-colors ${
                              photoMode === "upload"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <ImagePlus className="inline h-4 w-4 mr-1" />
                            Upload Images
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSwitchPhotoMode("camera")}
                            className={`pb-2 px-1 text-sm font-medium transition-colors ${
                              photoMode === "camera"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Camera className="inline h-4 w-4 mr-1" />
                            Capture from Camera
                          </button>
                        </div>

                        <div className="mt-4 grid gap-4">
                          {/* Upload */}
                          {photoMode === "upload" && (
                            <div className="rounded-2xl border border-border bg-background p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    Upload Images
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Multiple images supported (JPG/PNG).
                                  </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <ImagePlus className="h-5 w-5" />
                                </div>
                              </div>

                              <div className="mt-4 space-y-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      const filesArray = Array.from(e.target.files);
                                      setCapturedPhotos((prev) => [...prev, ...filesArray].slice(0, 5));
                                    }
                                  }}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {capturedPhotos.length}/5 images selected.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Camera Capture */}
                          {photoMode === "camera" && (
                            <div className="rounded-2xl border border-border bg-background p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    Capture from Camera
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {capturedPhotos.length > 0
                                      ? `${capturedPhotos.length}/5 frames captured`
                                      : "Capture frames live from your camera"}
                                  </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <Camera className="h-5 w-5" />
                                </div>
                              </div>

                              <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
                              <div className="relative aspect-video w-full rounded-lg bg-black overflow-hidden">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                {isCapturing && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {!isCameraOpen ? (
                                  <Button type="button" size="sm" onClick={startCamera} className="flex-1">
                                    <Camera className="h-4 w-4 mr-2 fill-current" />
                                    Start Camera
                                  </Button>
                                ) : (
                                  <>
                                    <Button type="button" size="sm" onClick={captureImage} disabled={isCapturing || capturedPhotos.length >= 5} className="flex-1">
                                      <Camera className="h-4 w-4 mr-2" />
                                      Capture Frame
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={stopCamera}>
                                      Stop
                                    </Button>
                                  </>
                                )}
                              </div>
                              {!isCameraOpen && (
                                <div className="mt-2 flex gap-2">
                                  <Button
                                    type="button"
                                    variant={cameraFacingMode === "user" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCameraFacingMode("user")}
                                    className="flex-1"
                                  >
                                    🤳 Front Camera
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={cameraFacingMode === "environment" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCameraFacingMode("environment")}
                                    className="flex-1"
                                  >
                                    📸 Back Camera
                                  </Button>
                                </div>
                              )}
                              {capturedPhotos.length > 0 && (
                                <div className="mt-4 flex gap-2 overflow-x-auto">
                                  {capturedPhotos.map((photo, i) => (
                                    <div key={i} className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden">
                                      <img src={URL.createObjectURL(photo)} alt={`Capture ${i}`} className="h-full w-full object-cover" />
                                      <button type="button" onClick={() => setCapturedPhotos(capturedPhotos.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-destructive/80 p-0.5 rounded-bl-md z-20">
                                        <X className="h-3 w-3 text-white" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <p className="mt-2 text-xs text-muted-foreground">
                                Capture exactly 5 frames. {capturedPhotos.length}/5 frames ready.
                              </p>
                            </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" onClick={stopCamera}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {editingStudentId ? "Update Student" : "Create Student"}
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
                  placeholder="Search by name, ID, or email…"
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

        {/* ── Students Table ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Students</CardTitle>
              <Badge variant="secondary">{students.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingStudents ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                        <span className="text-muted-foreground">Loading students...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <p className="text-muted-foreground">No students found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => {
                    const name = `${student.first_name} ${student.last_name}`;
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              fallback={name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                              size="sm"
                            />
                            <div>
                              <p className="font-medium text-foreground">
                                {name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {student.email}
                              </p>
                              {student.phone_no && (
                                <p className="text-xs text-muted-foreground">
                                  {student.phone_no}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {student.roll_number || student.id}
                        </TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>{student.year ?? "—"}</TableCell>
                        <TableCell>{student.semester}</TableCell>
                        <TableCell>
                          <Badge variant="success">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(student)}>
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(student)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {students.length} students
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
      {/* ── Delete Confirmation Dialog ────────────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.first_name} {deleteTarget?.last_name}
              </span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
