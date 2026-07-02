/**
 * Shared error message formatting utility
 * Used across forms for consistent error display
 */
export const getErrorMessage = (err: any, fallback: string = "An error occurred"): string => {
  const errorData = err?.response?.data?.error;
  
  if (!errorData) {
    return err?.response?.data?.message || err?.message || fallback;
  }
  
  if (typeof errorData === "string") {
    return errorData;
  }
  
  if (typeof errorData === "object") {
    return Object.entries(errorData)
      .map(([key, val]) => {
        const fieldName = key.replace(/_/g, " ");
        const messages = Array.isArray(val) ? val.join(", ") : String(val);
        return `${fieldName}: ${messages}`;
      })
      .join(" | ");
  }
  
  return fallback;
};
