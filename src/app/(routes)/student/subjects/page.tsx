"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { getAttendanceRateBadgeVariant } from "@/lib/badge-colors";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnrolledSubjects } from "@/hooks/useStudentDashboard";

export default function StudentSubjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"name" | "code" | "rate" | "department">("name");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Fetch data from backend with filters
  const { data: response, isLoading } = useEnrolledSubjects({
    search: searchQuery || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page: currentPage,
    page_size: pageSize,
  });

  const subjects = response?.subjects || [];
  const pagination = response?.pagination || {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    page_size: 10,
  };

  // Pagination helper
  const getVisiblePages = () => {
    const total = pagination.total_pages;
    const current = pagination.current_page;
    const delta = 1;
    const pages: (number | "ellipsis")[] = [];

    const range: number[] = [];
    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    pages.push(1);
    if (range[0] > 2) pages.push("ellipsis");
    pages.push(...range);
    if (range[range.length - 1] < total - 1) pages.push("ellipsis");
    if (total > 1) pages.push(total);

    return pages;
  };

  return (
    <>
      <TopNavbar title="Subjects" userInitials="ST" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Enrolled Subjects
            </h1>
            <p className="text-sm text-muted-foreground">
              View your enrolled subjects and their attendance details.
            </p>
          </div>
        </div>

        {/* ── Filters ── */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search by subject, code, or teacher…"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 w-full"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value as "name" | "code" | "rate" | "department");
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Subject Name</SelectItem>
                    <SelectItem value="code">Subject Code</SelectItem>
                    <SelectItem value="rate">Attendance Rate</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Order */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Order
                </label>
                <Select value={sortOrder} onValueChange={(value) => {
                  setSortOrder(value as "asc" | "desc");
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              onClick={() => {
                setSearchQuery("");
                setSortBy("name");
                setSortOrder("asc");
                setCurrentPage(1);
              }}
              variant="outline"
              className="w-full"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* ── Subjects Table ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Subjects</CardTitle>
              <Badge variant="secondary">
                {pagination.total_count} subjects
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : subjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No subjects found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block -mx-6 overflow-x-auto">
                  <div className="min-w-full px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject Code</TableHead>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead className="text-center">Semester</TableHead>
                          <TableHead className="text-center">Total Classes</TableHead>
                          <TableHead className="text-center">Attended</TableHead>
                          <TableHead className="text-center">Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjects.map((subject) => (
                          <TableRow key={subject.subject_id}>
                            <TableCell className="font-mono font-semibold text-sm">
                              {subject.subject_code}
                            </TableCell>
                            <TableCell className="font-medium max-w-xs truncate">
                              {subject.subject_name}
                            </TableCell>
                            <TableCell className="text-sm max-w-xs truncate">
                              {subject.teacher_name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {subject.department}
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {subject.semester}
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {subject.total_classes}
                            </TableCell>
                            <TableCell className="text-center text-sm font-medium text-emerald-600">
                              {subject.classes_attended}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={getAttendanceRateBadgeVariant(subject.attendance_rate)}
                              >
                                {subject.attendance_rate}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {subjects.map((subject) => (
                    <Card
                      key={subject.subject_id}
                      className="cursor-default"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-mono text-sm font-semibold">
                                {subject.subject_code}
                              </p>
                              <Badge
                                variant={getAttendanceRateBadgeVariant(subject.attendance_rate)}
                              >
                                {subject.attendance_rate}%
                              </Badge>
                            </div>
                            <p className="text-sm font-medium truncate">
                              {subject.subject_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {subject.teacher_name}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{subject.classes_attended}/{subject.total_classes}</span>
                              <span>{subject.department}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* ── Pagination ── */}
                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Showing {subjects.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(currentPage * pageSize, pagination.total_count)} of{" "}
                    {pagination.total_count} subjects
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {getVisiblePages().map((page, i) =>
                      page === "ellipsis" ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="px-1 text-sm text-muted-foreground select-none"
                        >
                          …
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(
                          Math.min(pagination.total_pages, currentPage + 1)
                        )
                      }
                      disabled={currentPage === pagination.total_pages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
