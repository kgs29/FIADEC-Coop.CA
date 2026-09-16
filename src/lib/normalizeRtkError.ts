import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

type NormalizedError = Readonly<{ status?: number; originalStatus?: number }>;

export function normalizeRtkError(
  error: FetchBaseQueryError | SerializedError
): NormalizedError {
  const status =
    "status" in error && typeof error.status === "number"
      ? error.status
      : undefined;
  const originalStatus =
    "originalStatus" in error && typeof error.originalStatus === "number"
      ? error.originalStatus
      : undefined;
  return { status, originalStatus };
}
