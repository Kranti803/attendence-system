"use client";

import React from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Info,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import {
  useClassSessionsWithFilters,
  useExportClassSessionsExcel,
} from "@/hooks/useClassSession";
import { useSubjects } from "@/hooks/useSubject";

const formatTime = (t: string) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
};

export default function AdminClassesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("date");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const { data: subjects = [] } = useSubjects();
  const { mutate: exportExcel, isPending: isExporting } =
    useExportClassSessionsExcel();

  const { data: sessionsData, isLoading } = useClassSessionsWithFilters({
    search: searchTerm || undefined,
    page: currentPage,
    page_size: itemsPerPage,
    ordering: sortBy,
  });

  const sessions = sessionsData?.results || [];
  const totalCount = sessionsData?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleExportExcel = () => {
    exportExcel(
      {
        search: searchTerm || undefined,
        ordering: sortBy,
      },
      {
        onSuccess: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `classes_${new Date().toISOString().split("T")[0]}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success("Classes exported successfully");
        },
        onError: (error) => {
          toast.error("Failed to export classes");
          console.error("Export error:", error);
        },
      },
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSortBy("date");
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortBy(`-${column}`);
    } else if (sortBy === `-${column}`) {
      setSortBy("date");
    } else {
      setSortBy(column);
    }
    setCurrentPage(1);
  };

  return (
    <>
      <TopNavbar title="Classes" userInitials="AU" />
      <div className="p-6 space-y-6">
        {/* ── Info Banner ─────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900">
              Classes are created automatically from Session Templates
            </p>
            <p className="text-xs text-blue-800">
              Teachers define recurring schedules (e.g., Monday 9 AM) in Session Templates. The system automatically creates class sessions for each occurrence. Learn more in the <a href="/help" className="underline">help documentation</a>.
            </p>
          </div>
        </div>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Class Sessions</h1>
            <p className="text-sm text-muted-foreground">
              Auto-generated class sessions from recurring templates.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>

        {/* ── Search / Filter ──────────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by class name, subject, or date…"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              {(searchTerm || sortBy !== "date") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Class Sessions</CardTitle>
              <Badge variant="secondary">{totalCount} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("class_name")}
                  >
                    Class {sortBy === "class_name" && "↑"}{" "}
                    {sortBy === "-class_name" && "↓"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("subject")}
                  >
                    Subject {sortBy === "subject" && "↑"}{" "}
                    {sortBy === "-subject" && "↓"}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("date")}
                  >
                    Date {sortBy === "date" && "↑"} {sortBy === "-date" && "↓"}
                  </TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Teacher</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                        <span className="text-muted-foreground">
                          Loading sessions...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <p className="text-muted-foreground">
                        No class sessions found.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      {/* Class name */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <p className="font-medium text-foreground">
                            {session.class_name}
                          </p>
                        </div>
                      </TableCell>

                      {/* Subject */}
                      <TableCell>
                        <div>
                          <p className="text-sm text-foreground">
                            {subjects.find((s) => s.id === session.subject)
                              ?.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {subjects.find((s) => s.id === session.subject)
                              ?.code ?? ""}
                          </p>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>

                      {/* Time */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(session.start_time)} —{" "}
                          {formatTime(session.end_time)}
                        </div>
                      </TableCell>

                      {/* Teacher */}
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-foreground">
                            {session.teacher_name || "—"}
                          </p>
                          {session.teacher_email && (
                            <p className="text-xs text-muted-foreground">
                              {session.teacher_email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
