"use client";

import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Pencil,
  Camera,
  Shield,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useProfile } from "@/hooks/useAuth";

export default function StudentProfilePage() {
  const { data: user, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-2">
        <p className="text-destructive font-medium">Failed to load profile data.</p>
      </div>
    );
  }

  const firstName = user.first_name || "N";
  const lastName = user.last_name || "A";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const fullName = `${user.first_name || "N/A"} ${user.last_name || ""}`.trim();

  return (
    <>
      <TopNavbar title="Profile" userInitials={initials} />
      <div className="p-6 space-y-6">
        {/* ── Profile Header Card ── */}
        <Card className="relative overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-linear-to-r from-primary via-primary-light to-primary-dark" />
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  fallback={initials}
                  size="xl"
                  className="h-24 w-24 text-2xl border-4 border-card shadow-lg"
                />
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary-dark transition-colors cursor-pointer">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      {fullName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Student ID: N/A
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Personal Information ── */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">
                        {user.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{user.phone_no || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">
                        {user.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Date of Birth
                      </p>
                      <p className="text-sm font-medium">N/A</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Guardian</p>
                      <p className="text-sm font-medium">N/A</p>
                      <p className="text-xs text-muted-foreground">
                        N/A
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Academic Info ── */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    Department
                  </div>
                  <span className="text-sm font-semibold">
                    N/A
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Semester
                  </span>
                  <span className="text-sm font-semibold">N/A</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Section</span>
                  <span className="text-sm font-semibold">N/A</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Batch</span>
                  <span className="text-sm font-semibold">N/A</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={user.is_active ? "success" : "secondary"}>
                    {user.is_active ? "Active" : "N/A"}
                  </Badge>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Enrolled Courses
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-sm">N/A</span>
                    <Badge variant="secondary">N/A</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Face Recognition Data ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Face Recognition Data</CardTitle>
                <CardDescription>
                  Your registered face data for attendance recognition
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4" />
                Re-register Face
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border p-4 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Shield className="h-7 w-7" />
                </div>
                <p className="text-sm font-semibold">Registration Status</p>
                <Badge variant="secondary" className="mt-1">
                  N/A
                </Badge>
              </div>
              <div className="rounded-xl border border-border p-4 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Camera className="h-7 w-7" />
                </div>
                <p className="text-sm font-semibold">Face Samples</p>
                <p className="text-2xl font-bold mt-1">N/A</p>
              </div>
              <div className="rounded-xl border border-border p-4 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Calendar className="h-7 w-7" />
                </div>
                <p className="text-sm font-semibold">Last Updated</p>
                <p className="text-sm text-muted-foreground mt-1">
                  N/A
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
