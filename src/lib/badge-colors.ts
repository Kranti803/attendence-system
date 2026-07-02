/**
 * Badge color utilities for consistent styling across pages
 */

/**
 * Get badge variant based on attendance rate percentage
 */
export const getAttendanceRateBadgeVariant = (
  rate: number,
  highThreshold: number = 90,
  midThreshold: number = 75
): "success" | "warning" | "destructive" => {
  if (rate >= highThreshold) return "success";
  if (rate >= midThreshold) return "warning";
  return "destructive";
};

/**
 * Get badge variant based on attendance status
 */
export const getStatusBadgeVariant = (
  status: "PRESENT" | "ABSENT" | string
): "success" | "destructive" => {
  return status === "PRESENT" ? "success" : "destructive";
};
