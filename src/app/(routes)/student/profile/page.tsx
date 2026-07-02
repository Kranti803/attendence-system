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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Camera,
  Shield,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useStudentProfile } from "@/hooks/useStudentDashboard";

export default function StudentProfilePage() {
  const { data: profile, isLoading, isError } = useStudentProfile();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-2">
        <p className="text-destructive font-medium">Failed to load profile data.</p>
      </div>
    );
  }

  const firstName = profile.first_name || "N";
  const lastName = profile.last_name || "A";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const fullName = `${profile.first_name || "N/A"} ${profile.last_name || ""}`.trim();

  return (
    <>
      <TopNavbar title="Profile" userInitials={initials} />
      <div className="p-6 space-y-6">
        {/* ── Profile Header Card ── */}
        <Card className="relative overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  fallback={initials}
                  className="h-24 w-24 text-2xl border-4 border-card shadow-lg"
                />
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/80 transition-colors cursor-pointer">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <div>
                <h1 className="text-xl font-bold text-foreground">
                  {fullName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Student ID: {profile.roll_number}
                </p>
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{profile.phone_no || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">
                        {profile.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Roll Number
                      </p>
                      <p className="text-sm font-medium">{profile.roll_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Year of Study
                      </p>
                      <p className="text-sm font-medium">Year {profile.year}</p>
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
                    {profile.department || "N/A"}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Status
                  </span>
                  <Badge variant={profile.is_active ? "success" : "secondary"}>
                    {profile.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Enrolled Courses
                  </span>
                  <span className="text-sm font-semibold">
                    {profile.enrollment_count}
                  </span>
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
                <Badge variant={profile.face_enrolled ? "success" : "secondary"} className="mt-1">
                  {profile.face_enrolled ? "Registered" : "Not Registered"}
                </Badge>
              </div>
              <div className="rounded-xl border border-border p-4 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Camera className="h-7 w-7" />
                </div>
                <p className="text-sm font-semibold">Face Samples</p>
                <p className="text-2xl font-bold mt-1">{profile.face_photos}</p>
              </div>
              <div className="rounded-xl border border-border p-4 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Calendar className="h-7 w-7" />
                </div>
                <p className="text-sm font-semibold">Match Confidence</p>
                <p className="text-2xl font-bold mt-1">{(profile.face_confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
