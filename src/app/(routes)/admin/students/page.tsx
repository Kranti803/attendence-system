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
} from "lucide-react";
import { useCreateStudent } from "@/hooks/useStudent";

/* ─── Static Data ─── */
const students = [
  {
    id: "STU001",
    name: "Alice Johnson",
    email: "alice@university.edu",
    department: "Computer Science",
    semester: "6th",
    status: "Active",
  },
  {
    id: "STU002",
    name: "Bob Williams",
    email: "bob@university.edu",
    department: "Mathematics",
    semester: "4th",
    status: "Active",
  },
  {
    id: "STU003",
    name: "Charlie Brown",
    email: "charlie@university.edu",
    department: "Physics",
    semester: "6th",
    status: "Inactive",
  },
  {
    id: "STU004",
    name: "Diana Ross",
    email: "diana@university.edu",
    department: "Computer Science",
    semester: "2nd",
    status: "Active",
  },
  {
    id: "STU005",
    name: "Ethan Hunt",
    email: "ethan@university.edu",
    department: "Engineering",
    semester: "8th",
    status: "Active",
  },
  {
    id: "STU006",
    name: "Fiona Apple",
    email: "fiona@university.edu",
    department: "Mathematics",
    semester: "4th",
    status: "Active",
  },
  {
    id: "STU007",
    name: "George Lucas",
    email: "george@university.edu",
    department: "Physics",
    semester: "6th",
    status: "Suspended",
  },
  {
    id: "STU008",
    name: "Hannah Montana",
    email: "hannah@university.edu",
    department: "Computer Science",
    semester: "2nd",
    status: "Active",
  },
];

export default function StudentManagementPage() {
  const [open, setOpen] = React.useState(false);
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
    phone_no: "",
    address: "",
    roll_number: "",
    department: "",
    year: "",
    user: "",
  });

  const [capturedPhotos, setCapturedPhotos] = React.useState<File[]>([]);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [isCapturing, setIsCapturing] = React.useState(false);

  const { mutate: addStudent, isPending } = useCreateStudent();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
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

  const captureImages = async () => {
    if (!videoRef.current || !isCameraOpen) return;
    setIsCapturing(true);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    const newPhotos: File[] = [];
    for (let i = 0; i < 5; i++) {
        if (ctx && videoRef.current) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}-${i}.jpg`, { type: 'image/jpeg' });
            newPhotos.push(file);
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
    }
    
    setCapturedPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
    setIsCapturing(false);
    stopCamera();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (capturedPhotos.length !== 5) {
      alert("Please capture or upload exactly 5 images.");
      return;
    }

    addStudent(
      {
        ...formData,
        year: parseInt(formData.year, 10),
        photos: capturedPhotos,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            first_name: "",
            last_name: "",
            phone_no: "",
            address: "",
            roll_number: "",
            department: "",
            year: "",
            user: "",
          });
          setCapturedPhotos([]);
          stopCamera();
        },
      }
    );
  };

  React.useEffect(() => {
    if (!open) stopCamera();
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
                    <DialogTitle>Add Student</DialogTitle>
                    <DialogDescription>
                      Register a student and collect face images for
                      recognition. Upload at least{" "}
                      <span className="font-medium text-foreground">3–5</span>{" "}
                      images.
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
                            User ID <span className="text-destructive">*</span>
                          </label>
                          <Input name="user" value={formData.user} onChange={handleInputChange} placeholder="UUID" required />
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
                      </div>
                    </div>

                    {/* Face Recognition Data */}
                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Face Recognition Data{" "}
                        <span className="text-destructive">(required)</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Provide at least 3–5 clear images with different angles
                        and lighting.
                      </p>

                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        {/* Upload */}
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

                        {/* Camera Capture (UI placeholder) */}
                        <div className="rounded-2xl border border-border bg-background p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                Camera Capture
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Capture multiple frames (UI only).
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
                                <Button type="button" variant="outline" size="sm" onClick={startCamera}>
                                  Start Camera
                                </Button>
                              ) : (
                                <Button type="button" variant="outline" size="sm" onClick={stopCamera}>
                                  Stop Camera
                                </Button>
                              )}
                              <Button type="button" size="sm" onClick={captureImages} disabled={!isCameraOpen || isCapturing}>
                                Capture 5 Frames
                              </Button>
                            </div>
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
                              Capture exactly 5 frames before saving.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" onClick={stopCamera}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Student
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
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          fallback={student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {student.id}
                    </TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "Active"
                            ? "success"
                            : student.status === "Inactive"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {student.status}
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
                Showing 1-8 of 1,234 students
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
