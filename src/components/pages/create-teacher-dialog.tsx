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
import { Plus, ChevronDown, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useCreateTeacher } from "@/hooks/useTeacher";

const departments = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Engineering",
  "Biology",
];

export function CreateTeacherDialog() {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutate: createTeacher, isPending } = useCreateTeacher();

  return (
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
  );
}
