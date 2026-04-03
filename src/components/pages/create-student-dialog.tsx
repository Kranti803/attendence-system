"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, ChevronDown, ImagePlus, Camera } from "lucide-react";

const departments = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Engineering",
  "Biology",
];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
const subjects = ["CS101", "CS201", "CS401", "MATH201", "PHY301", "ENG102"];

export function CreateStudentDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[calc(100svh-2rem)] overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Register a student and collect face images for recognition.
              Upload at least{" "}
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
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input placeholder="e.g. Alice Johnson" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Roll Number <span className="text-destructive">*</span>
                  </label>
                  <Input placeholder="e.g. STU-2026-001" required />
                  <p className="text-xs text-muted-foreground">
                    Must be unique.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input type="email" placeholder="alice@university.edu" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone Number{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input placeholder="+1 (234) 567-8900" />
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
                    Year / Semester{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      defaultValue=""
                      className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
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
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Enrolled Subjects{" "}
                    <span className="text-destructive">*</span>
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
                          required={s === subjects[0]}
                        />
                        <span className="font-mono text-xs text-muted-foreground">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select at least one subject.
                  </p>
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
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum: 3 images. Recommended: 5+ images.
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
                    <div className="aspect-video w-full rounded-lg bg-muted/50" />
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <Button type="button" variant="outline" size="sm">
                        Start Camera
                      </Button>
                      <Button type="button" size="sm">
                        Capture Frame
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Capture at least 3–5 frames before saving.
                    </p>
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
            <Button type="submit">Create Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
