"use client";
import { AuditTimeline } from "@/components/AuditTimeline";
import { ActivityLogEntry, useGetItemActivityLogQuery } from "@/store/apis/auth/authentication.api";
import { AuditAction } from "@/types/base";
import { Loader } from "lucide-react";

interface Props {
  readonly modelName: string;
  readonly objectId: string | number;
}

function toAuditAction(log: ActivityLogEntry): AuditAction {
  const changes: AuditAction["changes"] = Object.entries(log.changes ?? {}).map(
    ([field, values]) => ({
      field,
      old_value: String(values?.[0] ?? "") || null,
      new_value: String(values?.[1] ?? "") || null,
    })
  );
  const userId: string | null = log.user ? log.user.username : null;
  const reason: string | null = log.object_repr ? log.object_repr : null;
  return {
    action_date: log.timestamp,
    action_type: log.action,
    user_id: userId,
    changes,
    reason,
  };
}

export function ItemActivityHistory({ modelName, objectId }: Props) {
  const { data, isFetching } = useGetItemActivityLogQuery({ modelName, objectId });

  const auditLog: AuditAction[] = (data?.results ?? []).map(toAuditAction);

  if (isFetching) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return <AuditTimeline auditLog={auditLog} />;
}
