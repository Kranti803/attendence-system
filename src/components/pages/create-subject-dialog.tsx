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
import { Plus } from "lucide-react";

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

export function CreateSubjectDialog() {
  const [open, setOpen] = React.useState(false);

  return (
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
              Create a subject and optionally assign a teacher.
              Fields marked{" "}
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
                    Subject Name <span className="text-destructive">*</span>
                  </label>
                  <Input placeholder="e.g. Linear Algebra" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Subject Code <span className="text-destructive">*</span>
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
                    Department <span className="text-destructive">*</span>
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
                    <span className="text-muted-foreground">(optional)</span>
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
                  <span className="text-muted-foreground">(optional)</span>
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
  );
}
