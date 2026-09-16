"use client";

import { FormModal } from "@/components/modals/FormModal";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-btn";
import { PermissionInterface } from "@/types/permission.type";
import { RoleInterface, RolePayload, RuleInterface } from "@/types/rule.type";
import {
  useCreateRoleMutation,
  useGetPermissionsQuery,
  useGetRulesQuery,
  useUpdateRoleMutation,
  useUpdateRuleMutation,
} from "@/store/apis/auth/authentication.api";
import { useNavigateBack } from "@/utils/navigate-back";
import { Pencil, Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

/* -- Dialogue : édition des permissions d'un groupe -- */
type GroupPermissionsDialogProps = Readonly<{
  group: RuleInterface;
  allPermissions: PermissionInterface[];
  onClose: () => void;
}>;

function GroupPermissionsDialog({ group, allPermissions, onClose }: GroupPermissionsDialogProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>(
    (group.permissions ?? []).map((p) => String(p.id))
  );
  const [search, setSearch] = useState("");
  const [updateRule, { isLoading: saving }] = useUpdateRuleMutation();

  const filtered = allPermissions.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.codename.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      await updateRule({
        id: String(group.id),
        data: { name: group.name, permissions: selected },
      }).unwrap();
      toast.success(t("permissions_updated"));
      onClose();
    } catch {
      toast.error(t("an_error_occurred"));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            {t("permissions")} - <span className="text-primary">{group.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 flex-1 min-h-0">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_permission_placeholder")}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
          </div>

          {/* Compteur + effacer tout */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {selected.length} / {allPermissions.length} sélectionnée
              {selected.length > 1 ? "s" : ""}
            </span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => setSelected([])}
                className="hover:text-destructive transition-colors"
              >
                {t("clear_all")}
              </button>
            )}
          </div>

          {/* Liste des permissions */}
          <div className="border border-border rounded-lg overflow-y-auto flex-1 min-h-0 max-h-[50vh]">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">
                {t("no_permission_found")}
              </p>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((perm) => {
                  const checked = selected.includes(String(perm.id));
                  return (
                    <label
                      key={perm.id}
                      className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 ${
                        checked ? "bg-primary/5" : ""
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggle(String(perm.id))}
                        className="mt-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight truncate">
                          {perm.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {perm.codename}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <LoadingButton type="button" loading={saving} onClick={handleSave}>
            {t("save")}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ══ Formulaire rôle ══ */
type RoleFormProps = Readonly<{
  initial?: RoleInterface;
  id?: number | string;
  isUpdate?: boolean;
}>;

const RoleForm = ({ initial, id, isUpdate }: RoleFormProps) => {
  const { t } = useTranslation();
  const navigateBack = useNavigateBack();

  const [name, setName] = useState(initial?.name ?? "");
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>(
    initial?.groups?.map((g) => Number(g.id)) ?? []
  );
  const [search, setSearch] = useState("");
  const [editingGroup, setEditingGroup] = useState<RuleInterface | null>(null);

  const { data: groupsData, isFetching: loadingGroups } = useGetRulesQuery("page_size=200");
  const { data: allPermissions = [] } = useGetPermissionsQuery();
  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
  const isLoading = creating || updating;

  const toggleGroup = (groupId: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
    );
  };

  const allGroups = groupsData?.results ?? [];
  const filtered = allGroups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) { toast.error(t("name_required")); return; }
    const payload: RolePayload = { name, group_ids: selectedGroupIds };
    try {
      if (isUpdate && id !== undefined) {
        await updateRole({ id, data: payload }).unwrap();
        toast.success(t("updated_successfully"));
      } else {
        await createRole(payload).unwrap();
        toast.success(t("created_successfully"));
      }
      navigateBack();
    } catch { toast.error(t("an_error_occurred")); }
  };

  return (
    <>
      <FormModal
        isOpen={true}
        onClose={navigateBack}
        title={isUpdate ? t("edit_role", "Modifier un rôle") : t("create_role", "Ajouter un rôle")}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        maxWidth="max-w-xl"
      >
        <div className="space-y-6">
          <div className="space-y-2">
          <Label htmlFor="role-name">{t("name")} *</Label>
          <Input
            id="role-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("role_name_placeholder")}
            required
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>{t("groups_selection")}</Label>
            {selectedGroupIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedGroupIds([])}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                {t("clear_all")} ({selectedGroupIds.length})
              </button>
            )}
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_group_placeholder")}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {loadingGroups ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              {t("loading")}
            </div>
          ) : (
            <div className="border border-border rounded-lg max-h-80 overflow-y-auto divide-y divide-border">
              {filtered.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">{t("no_group_found")}</p>
              ) : (
                filtered.map((group) => {
                  const isSelected = selectedGroupIds.includes(Number(group.id));
                  return (
                    <div
                      key={group.id}
                      className={`flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50 ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      <label className="flex items-start gap-3 flex-1 cursor-pointer min-w-0">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleGroup(Number(group.id))}
                          className="mt-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-tight">{group.name}</p>
                          {group.permissions && group.permissions.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {group.permissions.length} {t("permissions")}
                              {" · "}
                              {group.permissions.slice(0, 3).map((p) => p.codename).join(", ")}
                              {group.permissions.length > 3 && "…"}
                            </p>
                          )}
                        </div>
                      </label>
                      {/* Bouton édition des permissions */}
                      <button
                        type="button"
                        title="Modifier les permissions"
                        onClick={() => setEditingGroup(group)}
                        className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {allGroups.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedGroupIds.length} / {allGroups.length} sélectionné
              {selectedGroupIds.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        </div>
      </FormModal>

      {/* Dialogue édition permissions */}
      {editingGroup && (
        <GroupPermissionsDialog
          group={editingGroup}
          allPermissions={allPermissions}
          onClose={() => setEditingGroup(null)}
        />
      )}
    </>
  );
};

export default RoleForm;
