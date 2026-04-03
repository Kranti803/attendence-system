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
import { Plus, ChevronDown } from "lucide-react";

const subjects = ["CS101", "CS201", "CS401", "MATH201", "PHY301", "ENG102"];
const teachers = [
  "Dr. Sarah Wilson",
  "Prof. James Carter",
  "Dr. Emily Chen",
  "Prof. Robert Hill",
];

export function CreateClassDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Create Class
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
            <DialogTitle>Create Class (Session)</DialogTitle>
            <DialogDescription>
              Define a specific class session where attendance will be
              taken.
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
                    Class Name / Section{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input placeholder='e.g. "Section A"' required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Subject <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      defaultValue=""
                      className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="" disabled>
                        Select subject…
                      </option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Teacher <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      defaultValue=""
                      className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
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
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">
                Schedule Info
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-sm font-medium text-foreground">
                    Date <span className="text-destructive">*</span>
                  </label>
                  <Input type="date" required />
                </div>
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-sm font-medium text-foreground">
                    Start Time <span className="text-destructive">*</span>
                  </label>
                  <Input type="time" required />
                </div>
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-sm font-medium text-foreground">
                    End Time{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input type="time" />
                </div>
              </div>
            </div>

            {/* Optional (Advanced) */}
            <div className="rounded-2xl border border-border bg-muted/10 p-4">
              <p className="text-sm font-semibold text-foreground">
                Optional (Advanced)
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Room / Location{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input placeholder="e.g. Room 201" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Session Type{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      defaultValue=""
                      className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="" disabled>
                        Select type…
                      </option>
                      <option value="Lecture">Lecture</option>
                      <option value="Lab">Lab</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
            <Button type="submit">Create Session</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
