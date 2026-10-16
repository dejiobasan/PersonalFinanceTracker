import type { ErrorResponseDto } from "@/types";

export interface CustomApiError {
  data?: ErrorResponseDto | { message?: string | string[]; error?: string };
  status?: number;
  message?: string;
  error?: string;
}

/**
 * Extracts a user-friendly error message from any error object, including
 * RTK Query mutation errors, ErrorResponseDto, native Error instances, or strings.
 *
 * @param error - The caught error object
 * @param fallback - Default message to return if no specific message is extracted
 * @returns Extracted error message string
 */
export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred. Please try again."
): string {
  if (!error) return fallback;

  if (typeof error === "string") {
    return error.trim() || fallback;
  }

  if (typeof error === "object") {
    const err = error as CustomApiError;

    // Check backend API ErrorResponseDto payload
    if (err.data) {
      if (typeof err.data.message === "string" && err.data.message.trim()) {
        return err.data.message;
      }

      if (Array.isArray(err.data.message) && err.data.message.length > 0) {
        return err.data.message.join(", ");
      }

      if (
        "error" in err.data &&
        typeof err.data.error === "string" &&
        err.data.error.trim()
      ) {
        return err.data.error;
      }
    }

    // Check top-level message
    if (typeof err.message === "string" && err.message.trim()) {
      return err.message;
    }

    // Check RTK Query stringified error
    if (typeof err.error === "string" && err.error.trim()) {
      return err.error;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
