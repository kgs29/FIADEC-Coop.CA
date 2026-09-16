"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import i18n from "@/locale/i18n";
import { AuditAction, AuditChange } from "@/types/base";
import { format } from "date-fns";
import { enGB, fr } from "date-fns/locale";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Label } from "./ui/label";

type Props = {
  auditLog: AuditAction[];
};

const actionStyles: Record<string, string> = {
  create: "border-green-400 text-green-600 bg-green-50",
  update: "border-blue-400 text-blue-600 bg-blue-50",
  delete: "border-red-400 text-red-600 bg-red-50",
};

const actionIcons: Record<string, string> = {
  create: "➕",
  update: "✏️",
  delete: "🗑️",
};

const locale = i18n.language === "en" ? enGB : fr;

export function AuditTimeline({ auditLog }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 p-5 w-full bg-white">
      <div className="flex flex-col gap-1">
        <Label className="font-bold text-lg">{t("modifHistory")}</Label>
        <Separator />
      </div>
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 20rem)" }}
      >
        <div
          data-testid="audit-timeline"
          className="relative flex flex-col gap-2 pl-4 before:absolute before:top-0 before:h-full before:w-px before:bg-gray-200"
        >
          {auditLog.map((action) => (
            <div key={action.action_date} className="relative">
              {/* Dot */}
              <div className="absolute -left-[10px] top-3 flex items-center justify-center w-full">
                <span
                  className={`${actionStyles[action.action_type] ?? actionStyles.delete} border text-[0.5rem] p-1 rounded-full`}
                >
                  {actionIcons[action.action_type] ?? "•"}
                </span>
                <div className="flex flex-col gap-1 ml-1 w-full justify-between items-center">
                  <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`h-4 px-1.5 text-[10px] font-medium uppercase ${
                          actionStyles[action.action_type]
                        }`}
                      >
                        {t(action.action_type)}
                      </Badge>
                      <span className="text-[11px] text-gray-500">
                        {format(action.action_date, "PP", { locale: locale })}
                        {" - "}
                        {format(action.action_date, "HH:mm", {
                          locale: locale,
                        })}
                      </span>
                    </div>
                    {action.user_id && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <span className="border rounded-full p-0.5">
                          <User className="size-2.5" />
                        </span>

                        <span className="text-[11px] text-gray-400">
                          {action.user_id}
                        </span>
                      </div>
                    )}
                  </div>
                  <Separator />
                </div>
              </div>

              <div className="space-y-2 pt-9 px-4">
                {action.reason && (
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {action.reason}
                  </p>
                )}

                {/* Changes */}
                {action.changes.length > 0 && (
                  <div>
                    <div className="space-y-1">
                      {action.changes.map((change: AuditChange) => (
                        <div
                          key={change.field}
                          className="flex flex-col items-start gap-1.5 text-xs text-gray-600"
                        >
                          <span className="font-medium text-gray-800 underline">
                            {change.field} :
                          </span>
                          <div className="flex flex-col items-start justify-center gap-0.5 px-2">
                            <span className="line-through text-red-400">
                              {change.old_value || "—"}
                            </span>

                            <span className="font-medium text-gray-600">
                              {change.new_value || "—"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
