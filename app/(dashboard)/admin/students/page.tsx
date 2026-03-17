"use client";

import { TopNavbar } from "@/components/layout/top-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Filter,
  Download,
} from "lucide-react";

/* ─── Static Data ─── */
const students = [
  { id: "STU001", name: "Alice Johnson",   email: "alice@university.edu",  department: "Computer Science", semester: "6th", status: "Active" },
  { id: "STU002", name: "Bob Williams",    email: "bob@university.edu",    department: "Mathematics",      semester: "4th", status: "Active" },
  { id: "STU003", name: "Charlie Brown",   email: "charlie@university.edu",department: "Physics",          semester: "6th", status: "Inactive" },
  { id: "STU004", name: "Diana Ross",      email: "diana@university.edu",  department: "Computer Science", semester: "2nd", status: "Active" },
  { id: "STU005", name: "Ethan Hunt",      email: "ethan@university.edu",  department: "Engineering",      semester: "8th", status: "Active" },
  { id: "STU006", name: "Fiona Apple",     email: "fiona@university.edu",  department: "Mathematics",      semester: "4th", status: "Active" },
  { id: "STU007", name: "George Lucas",    email: "george@university.edu", department: "Physics",          semester: "6th", status: "Suspended" },
  { id: "STU008", name: "Hannah Montana",  email: "hannah@university.edu", department: "Computer Science", semester: "2nd", status: "Active" },
];

export default function StudentManagementPage() {
  return (
    <>
      <TopNavbar title="Student Management" userInitials="AU" />
      <div className="p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-sm text-muted-foreground">
              Manage all enrolled students in the system.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        {/* ── Filters ── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or email…"
                  className="pl-9"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Department
                </Button>
                <Button variant="outline" size="default">
                  <Filter className="h-4 w-4" />
                  Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Students Table ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Students</CardTitle>
              <Badge variant="secondary">{students.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          fallback={student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {student.id}
                    </TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "Active"
                            ? "success"
                            : student.status === "Inactive"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing 1-8 of 1,234 students
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark">
                  1
                </Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
