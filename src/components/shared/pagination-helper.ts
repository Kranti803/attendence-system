/**
 * Pagination helper to generate visible page numbers with ellipsis
 * Used across all paginated list pages
 * 
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param delta - Number of pages to show on each side of current
 * @returns Array of page numbers or "ellipsis" strings
 */
export const getVisiblePages = (
  currentPage: number,
  totalPages: number,
  delta: number = 1
): (number | "ellipsis")[] => {
  const pages: (number | "ellipsis")[] = [];

  const range: number[] = [];
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  pages.push(1);
  if (range[0] > 2) pages.push("ellipsis");
  pages.push(...range);
  if (range[range.length - 1] < totalPages - 1) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
};
