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
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { getStatusBadgeVariant } from "@/lib/badge-colors";
import { format } from "date-fns";
import { useAttendanceHistory, useEnrolledSubjects } from "@/hooks/useStudentDashboard";

export default function AttendanceHistoryPage() {
  // State for filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"subject" | "date" | "status">("date");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Fetch data
  const { data: enrolledResponse } = useEnrolledSubjects();
  const courses = enrolledResponse?.subjects || [];
  
  const historyParams = {
    search: searchQuery || undefined,
    subject_id: subjectFilter || undefined,
    status: (statusFilter as 'PRESENT' | 'ABSENT' | undefined) || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page: currentPage,
    page_size: pageSize,
  };

  const { data: historyData, isLoading } = useAttendanceHistory(historyParams);

  const records = historyData?.records || [];
  const pagination = historyData?.pagination || {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    page_size: 10,
  };
  const summary = historyData?.summary || {
    total_present: 0,
    total_absent: 0,
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
      <TopNavbar title="Attendance History" userInitials="ST" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Attendance History
            </h1>
            <p className="text-sm text-muted-foreground">
              Your complete attendance record for this semester.
            </p>
          </div>
        </div>

        {/* ── Quick Stats ── */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground">Total Classes</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {pagination.total_count}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {summary.total_present}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {summary.total_absent}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Filters ── */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Search & Subject & Status & Dates */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search by subject…"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 w-full"
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Subject
                </label>
                <Select value={subjectFilter} onValueChange={(value) => {
                  setSubjectFilter(value || "");
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
                    {Array.isArray(courses) ? courses.map((course) => (
                      <SelectItem key={course.subject_id} value={course.subject_id}>
                        {course.subject_code} - {course.subject_name}
                      </SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value || "");
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="PRESENT">Present</SelectItem>
                    <SelectItem value="ABSENT">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date Calendar */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Start Date
                </label>
                <Popover>
                  <PopoverTrigger >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {startDate ? format(new Date(startDate), "MMM dd, yyyy") : "Pick date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate ? new Date(startDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date.toISOString().split("T")[0]);
                          setCurrentPage(1);
                        }
                      }}
                      disabled={(date) =>
                        (endDate ? date > new Date(endDate) : false) || date > new Date()
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date Calendar */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  End Date
                </label>
                <Popover>
                  <PopoverTrigger >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {endDate ? format(new Date(endDate), "MMM dd, yyyy") : "Pick date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate ? new Date(endDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setEndDate(date.toISOString().split("T")[0]);
                          setCurrentPage(1);
                        }
                      }}
                      disabled={(date) =>
                        (startDate ? date < new Date(startDate) : false) || date > new Date()
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value as "subject" | "date" | "status");
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="subject">Subject</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  &nbsp;
                </label>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSubjectFilter("");
                    setStatusFilter("");
                    setStartDate("");
                    setEndDate("");
                    setSortBy("date");
                    setSortOrder("desc");
                    setCurrentPage(1);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── History Table ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed History</CardTitle>
              <Badge variant="secondary">
                {pagination.total_count} records
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No attendance records found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <>
                {/* Horizontal scroll wrapper */}
                <div className="-mx-4 overflow-x-auto sm:mx-0">
                  <div className="min-w-[800px] px-4 sm:min-w-0 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right">Confidence</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records.map((record, idx) => (
                          <TableRow key={`${record.id}-${idx}`}>
                            <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                              {record.date}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {record.time}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div>
                                <span className="font-medium block">
                                  {record.subject_code}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {record.subject_name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {record.class_name}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span className="truncate block max-w-xs">
                                {record.teacher_name}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={getStatusBadgeVariant(record.status)}
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                              {(record.detection_confidence * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* ── Pagination ── */}
                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Showing {records.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(currentPage * pageSize, pagination.total_count)} of{" "}
                    {pagination.total_count} records
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
