"use client";
import { FormModal } from "@/components/modals/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateADGroupMappingMutation,
  useGetRolesQuery,
  useUpdateADGroupMappingMutation,
} from "@/store/apis/auth/authentication.api";
import { ADGroupMappingInterface, ADGroupMappingPayload } from "@/types/rule.type";
import { useNavigateBack } from "@/utils/navigate-back";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ADGroupMappingForm = ({
  initial,
  id,
  isUpdate,
}: {
  initial?: ADGroupMappingInterface;
  id?: number | string;
  isUpdate?: boolean;
}) => {
  const { t } = useTranslation();
  const navigateBack = useNavigateBack();

  const [adGroupName, setAdGroupName] = useState(initial?.ad_group_name ?? "");
  const [roleId, setRoleId] = useState<number | "">(initial?.role ?? "");

  const { data: rolesData, isFetching: loadingRoles } = useGetRolesQuery("size=200");
  const [createMapping, { isLoading: creating }] = useCreateADGroupMappingMutation();
  const [updateMapping, { isLoading: updating }] = useUpdateADGroupMappingMutation();
  const isLoading = creating || updating;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!adGroupName.trim() || !roleId) {
      toast.error(t("fill_all_fields"));
      return;
    }
    const payload: ADGroupMappingPayload = { ad_group_name: adGroupName.trim(), role: Number(roleId) };
    try {
      if (isUpdate && id !== undefined) {
        await updateMapping({ id, data: payload }).unwrap();
        toast.success(t("updated_successfully"));
      } else {
        await createMapping(payload).unwrap();
        toast.success(t("created_successfully"));
      }
      navigateBack();
    } catch {
      toast.error(t("an_error_occurred"));
    }
  };

  return (
    <FormModal
      isOpen={true}
      onClose={navigateBack}
      title={isUpdate ? t("edit_mapping", "Modifier un mapping") : t("create_mapping", "Ajouter un mapping")}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      maxWidth="max-w-xl"
    >
      <div className="space-y-2">
        <Label htmlFor="ad-group-name">{t("ad_group_name")} *</Label>
        <Input
          id="ad-group-name"
          value={adGroupName}
          onChange={(e) => setAdGroupName(e.target.value)}
          placeholder="CN=FIADEC-Editors,OU=Groups,DC=domain,DC=com"
          required
        />
        <p className="text-xs text-gray-500">{t("ad_group_name_hint")}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role-select">{t("role")} *</Label>
        {loadingRoles ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            {t("loading")}
          </div>
        ) : (
          <select
            id="role-select"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value ? Number(e.target.value) : "")}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">{t("select_role")}</option>
            {rolesData?.results.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        )}
      </div>
    </FormModal>
  );
};

export default ADGroupMappingForm;
