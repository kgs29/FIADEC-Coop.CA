import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "react-hot-toast";

export interface ApiErrorData {
  error?: {
    message?: string;
    code?: string;
  };
  [key: string]: unknown;
}

export const handleApiError = (
  err: unknown,
  router: AppRouterInstance,
  t: (key: string) => string,
) => {
  const typedErr = err as { status?: number; data?: ApiErrorData };
  const status = typedErr?.status;
  const data = typedErr?.data;

  if (status === 401) {
    toast.error(t("unauthorized") || "Session expirée");
    router.push("/login");
    return;
  }

  if (status === 400 && data && !data.error) {
    Object.entries(data).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        toast.error(`${t(field)}: ${messages[0]}`);
      } else if (typeof messages === "string") {
        toast.error(`${t(field)}: ${messages}`);
      }
    });
    return;
  }

  if (data?.error?.message) {
    toast.error(data.error.message);
    return;
  }

  toast.error(t("error_occurred") || "Une erreur est survenue");
};
