"use client";

import { FormModal } from "@/components/modals/FormModal";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateRuleMutation,
  useGetPermissionsQuery,
  useUpdateRuleMutation,
} from "@/store/apis/auth/authentication.api";
import { RuleInterface } from "@/types/rule.type";
import { useNavigateBack } from "@/utils/navigate-back";
import { Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const RuleForm = ({
  initial,
  id,
  isUpdate,
}: {
  initial?: RuleInterface;
  id?: string;
  isUpdate?: boolean;
}) => {
  const { t } = useTranslation();
  const navigateBack = useNavigateBack();

  const [name, setName] = useState(initial?.name ?? "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initial?.permissions?.map((p) => String(p.id)) ?? []
  );
  const [search, setSearch] = useState("");

  const { data: permissions, isFetching: loadingPerms } = useGetPermissionsQuery();
  const [createRule, { isLoading: creating }] = useCreateRuleMutation();
  const [updateRule, { isLoading: updating }] = useUpdateRuleMutation();
  const isLoading = creating || updating;

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const filtered = (permissions ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.codename.toLowerCase().includes(search.toLowerCase())
  );

  const filteredIds = filtered.map((p) => String(p.id));
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((filteredId) => selectedPermissions.includes(filteredId));
  const someFilteredSelected = !allFilteredSelected &&
    filteredIds.some((filteredId) => selectedPermissions.includes(filteredId));

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedPermissions((prev) => prev.filter((permId) => !filteredIds.includes(permId)));
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!name.trim()) { toast.error(t("name_required")); return; }
    const payload = { name, permissions: selectedPermissions };
    try {
      if (isUpdate && id) {
        await updateRule({ id, data: payload }).unwrap();
        toast.success(t("updated_successfully"));
      } else {
        await createRule(payload).unwrap();
        toast.success(t("created_successfully"));
      }
      navigateBack();
    } catch { toast.error(t("an_error_occurred")); }
  };

  let checkboxState = "unchecked";
  if (someFilteredSelected) checkboxState = "indeterminate";
  else if (allFilteredSelected) checkboxState = "checked";

  return (
    <FormModal
      isOpen={true}
      onClose={navigateBack}
      title={isUpdate ? t("edit_rule", "Modifier un groupe") : t("create_rule", "Ajouter un groupe")}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")} *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("group_name_placeholder")}
          required
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{t("permissions")}</Label>
          <div className="flex items-center gap-3">
            {selectedPermissions.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedPermissions([])}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                {t("clear_all")} ({selectedPermissions.length})
              </button>
            )}
          </div>
        </div>

        {/* Case à cocher tout sélectionner / désélectionner */}
        {!loadingPerms && filtered.length > 0 && (
          <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
            <Checkbox
              checked={allFilteredSelected}
              data-state={checkboxState}
              onCheckedChange={toggleAllFiltered}
              className="shrink-0"
            />
            <span className="text-sm font-medium text-muted-foreground">
              {allFilteredSelected
                ? ["Tout désélectionner", search ? " (filtrés)" : ""].join("")
                : ["Tout sélectionner (", filtered.length, search ? " filtrés" : "", ")"].join("")}
            </span>
          </label>
        )}

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_permission_placeholder")}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {loadingPerms ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            {t("loading")}
          </div>
        ) : (
          <div className="border border-border rounded-lg max-h-80 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">{t("no_permission_found")}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0">
                {filtered.map((perm, idx) => {
                  const checked = selectedPermissions.includes(String(perm.id));
                  const borderClass = idx % 2 === 0 ? "sm:border-r border-border" : "";
                  const checkedClass = checked ? "bg-primary/5" : "";
                  const labelClass = [
                    "flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50",
                    borderClass,
                    checkedClass,
                  ].join(" ");
                  return (
                    <label
                      key={perm.id}
                      className={labelClass}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => togglePermission(String(perm.id))}
                        className="mt-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight truncate">{perm.name}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">{perm.codename}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {permissions && permissions.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {selectedPermissions.length} / {permissions.length} sélectionnée{selectedPermissions.length > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </FormModal>
  );
};

export default RuleForm;
