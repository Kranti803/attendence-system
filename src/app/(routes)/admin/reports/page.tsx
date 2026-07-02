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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar as CalendarIcon,
  FileSpreadsheet,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

import { useAdminReports, useExportAdminReportsExcel } from "@/hooks/useAdminReports";

function AdminReportsPage() {
  // Get today's date and 7 days ago as default range
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const defaultStartDate = sevenDaysAgo.toISOString().split("T")[0];
  const defaultEndDate = today.toISOString().split("T")[0];

  // ── State for filters ──
  const [startDate, setStartDate] = React.useState(defaultStartDate);
  const [endDate, setEndDate] = React.useState(defaultEndDate);
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"date" | "class" | "rate" | "present" | "department">("date");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // ── Fetch reports from backend ──
  const reportParams = {
    start_date: startDate,
    end_date: endDate,
    department: departmentFilter || undefined,
    search: searchQuery || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page: currentPage,
    page_size: pageSize,
  };

  const { data: reportData, isLoading } = useAdminReports(reportParams);
  const exportMutation = useExportAdminReportsExcel();

  // Common departments
  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Engineering",
    "Biology",
  ];

  // ── Handlers ──
  const handleApplyFilters = () => {
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }
    setCurrentPage(1); // Reset to first page
    toast.success("Filters applied");
  };

  const handleReset = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setDepartmentFilter("");
    setSearchQuery("");
    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);
    toast.success("Filters reset");
  };

  const handleExportExcel = () => {
    if (!reportData || reportData.sessions.length === 0) {
      toast.error("No data to export");
      return;
    }

    exportMutation.mutate(reportParams, {
      onSuccess: (blob) => {
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `admin_reports_${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Report exported as Excel");
      },
      onError: (err) => {
        toast.error("Failed to export report: " + (err.message || "Unknown error"));
      },
    });
  };

  const summaryStats = reportData?.summary || {
    total_sessions: 0,
    average_rate: 0,
    best_rate: 0,
    worst_rate: 0,
    total_present: 0,
    total_absent: 0,
  };

  const sessionReports = reportData?.sessions || [];
  const pagination = reportData?.pagination || {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
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
      <TopNavbar title="Reports" userInitials="AU" />
      <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Attendance Reports
            </h1>
            <p className="text-sm text-muted-foreground">
              View and export detailed attendance reports across all departments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={!reportData || reportData.sessions.length === 0 || exportMutation.isPending}
              className="w-full sm:w-auto"
            >
              {exportMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin shrink-0" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 mr-2 shrink-0" />
              )}
              <span className="truncate">
                {exportMutation.isPending ? "Exporting..." : "Export Excel"}
              </span>
            </Button>
          </div>
        </div>

        {/* ── Filters ── */}
        <Card>
          <CardContent className="p-3 space-y-4 sm:p-4">
            {/* Date Range & Department */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
              {/* Start Date Picker */}
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground block mb-2">Start Date</label>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {format(new Date(startDate), "MMM dd, yyyy")}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(startDate)}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date.toISOString().split("T")[0]);
                        }
                      }}
                      disabled={(date) =>
                        date > new Date(endDate) || date > new Date()
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date Picker */}
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground block mb-2">End Date</label>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {format(new Date(endDate), "MMM dd, yyyy")}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(endDate)}
                      onSelect={(date) => {
                        if (date) {
                          setEndDate(date.toISOString().split("T")[0]);
                        }
                      }}
                      disabled={(date) =>
                        date < new Date(startDate) || date > new Date()
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Department Filter */}
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground block mb-2">Department</label>
                <Select value={departmentFilter} onValueChange={(value) => setDepartmentFilter(value || "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons */}
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground mb-2 hidden lg:block lg:invisible">
                  Actions
                </label>
                <div className="flex gap-2">
                  <Button onClick={handleApplyFilters} size="default" className="flex-1 lg:flex-none">
                    Apply
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="default" className="flex-1 lg:flex-none">
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Search & Sort */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Search */}
              <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium text-foreground block mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Class name..."
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
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground block mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value as "date" | "class" | "rate" | "present" | "department");
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="rate">Attendance Rate</SelectItem>
                    <SelectItem value="present">Present Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground block mb-2">Order</label>
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
            </div>
          </CardContent>
        </Card>

        {/* ── Summary Cards ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 sm:p-5">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Average Rate</p>
                    <p className="text-2xl font-bold text-primary mt-2 sm:text-3xl">
                      {(summaryStats.average_rate || 0).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across {summaryStats.total_sessions} sessions
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary/20 shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <p className="text-2xl font-bold text-foreground mt-2 sm:text-3xl">
                      {summaryStats.total_sessions}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      in selected period
                    </p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-muted-foreground/20 shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Best Attendance</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-2 sm:text-3xl">
                      {(summaryStats.best_rate || 0).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Highest rate
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-600/20 shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Reports Table ── */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Detailed Reports</CardTitle>
              <Badge variant="secondary" className="w-fit">
                {pagination.total_count} total • Page {pagination.current_page}/{pagination.total_pages}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-wrap gap-4 p-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : sessionReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No attendance records found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your filters or search query
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
                          <TableHead>Class</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead className="text-center">Present</TableHead>
                          <TableHead className="text-center">Absent</TableHead>
                          <TableHead className="text-center">Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessionReports.map((report, idx) => (
                          <TableRow key={`${report.session_id}-${report.date}-${idx}`}>
                            <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                              {report.date}
                            </TableCell>
                            <TableCell className="font-medium">
                              <span className="block truncate max-w-[160px] sm:max-w-none">
                                {report.class_name}
                              </span>
                              <span className="block text-xs text-muted-foreground font-normal truncate max-w-[160px] sm:max-w-none">
                                {report.subject_code}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              {report.department}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span className="block truncate max-w-[120px]">
                                {report.teacher_name}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {report.total}
                            </TableCell>
                            <TableCell className="text-center text-emerald-600 font-medium">
                              {report.present}
                            </TableCell>
                            <TableCell className="text-center text-red-600 font-medium">
                              {report.absent}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={
                                  report.attendance_rate >= 90
                                    ? "success"
                                    : report.attendance_rate >= 80
                                    ? "warning"
                                    : "destructive"
                                }
                              >
                                {report.attendance_rate.toFixed(1)}%
                              </Badge>
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
                    Showing {sessionReports.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(currentPage * pageSize, pagination.total_count)} of {pagination.total_count} records
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
                      onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
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

        {/* ── Summary Stats Row ── */}
        {!isLoading && sessionReports.length > 0 && (
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Marked</p>
                  <p className="text-xl font-bold mt-1 sm:text-2xl">
                    {summaryStats.total_present + summaryStats.total_absent}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Present</p>
                  <p className="text-xl font-bold text-emerald-600 mt-1 sm:text-2xl">
                    {summaryStats.total_present}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Absent</p>
                  <p className="text-xl font-bold text-red-600 mt-1 sm:text-2xl">
                    {summaryStats.total_absent}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Worst Rate</p>
                  <p className="text-xl font-bold text-yellow-600 mt-1 sm:text-2xl">
                    {(summaryStats.worst_rate || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

export default AdminReportsPage;
