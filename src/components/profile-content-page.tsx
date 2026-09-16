"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { handleApiError } from "@/lib/handleApiError";
import { hashPassword } from "@/lib/hashPassword";
import PermissionGuard from "@/lib/PermissionGuard";
import {
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} from "@/store/apis/auth/authentication.api";
import {
  CheckCheck,
  Edit,
  Eye,
  EyeOff,
  Key,
  Loader,
  PencilRuler,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://127.0.0.1:8000/v1/").replace(/\/v1\/?$/, "");

function buildAvatarSrc(photo?: string | null): string | undefined {
  if (!photo) return undefined;
  if (photo.startsWith("http")) return photo;
  if (photo.startsWith("/")) return `${BACKEND_ORIGIN}${photo}`;
  return `${BACKEND_ORIGIN}/media/${photo}`;
}

const ProfileContentPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isUpdate, setIsUpdate] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [changePasswordMutation] = useChangePasswordMutation();
  const [updateProfileMutation] = useUpdateProfileMutation();

  const { data: user } = useGetUserProfileQuery();

  const [password, setPassword] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [userData, setUserData] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    phone_number: user?.phone_number,
  });

  const handleCancel = () => {
    setChangePassword(false);
    setPassword({ old_password: "", new_password: "", confirm_password: "" });
  };

  const handleChangePassword = async () => {
    setIsLoadingPassword(true);
    try {
      const response = await changePasswordMutation({
        body: {
          old_password: await hashPassword(password.old_password),
          new_password: await hashPassword(password.new_password),
          confirm_password: await hashPassword(password.confirm_password),
        },
      });
      if (response.error) {
        handleApiError(response.error, router, t);
      } else {
        const msg = (response.data as { message?: string })?.message ?? t("updated_successfully");
        toast.success(msg);
        setChangePassword(false);
        setPassword({ old_password: "", new_password: "", confirm_password: "" });
      }
    } catch (error) {
      handleApiError(error, router, t);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoadingProfile(true);
    if (
      userData.first_name === user?.first_name &&
      userData.last_name === user?.last_name &&
      userData.email === user?.email &&
      userData.phone_number === user?.phone_number
    ) {
      setIsLoadingProfile(false);
      return;
    }
    try {
      const response = await updateProfileMutation({
        body: {
          first_name: userData.first_name!,
          last_name: userData.last_name!,
          email: userData.email!,
          phone_number: userData.phone_number!,
        },
      });
      if (response.error) {
        handleApiError(response.error, router, t);
      } else {
        const msg = (response.data as { message?: string })?.message ?? t("updated_successfully");
        toast.success(msg);
        setIsUpdate(false);
      }
    } catch (error) {
      handleApiError(error, router, t);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const avatarSrc = buildAvatarSrc(user?.profile_photo);
  const displayName = `${user?.username ?? ""} ${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const fallbackInitials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const disabledProfile =
    Object.values(userData).includes("") ||
    (userData.email === (user?.email ?? "") &&
      userData.first_name === (user?.first_name ?? "") &&
      userData.last_name === (user?.last_name ?? "") &&
      userData.phone_number === (user?.phone_number ?? ""));

  const editButtons = (
    <div className="flex gap-2">
      <Button className="bg-destructive hover:bg-destructive/80" onClick={() => setIsUpdate(false)} aria-label={t("cancel")}>
        <X className="size-4" />
        {t("cancel")}
      </Button>
      <Button disabled={disabledProfile} onClick={handleUpdateProfile} aria-label={t("save")}>
        {isLoadingProfile ? <Loader className="animate-spin size-4" /> : <Save className="size-4" />}
        {t("save")}
      </Button>
    </div>
  );

  // Gather all permissions from all groups for display
  const allPermissions = user?.groups?.flatMap((g) => g.permissions ?? []) ?? [];

  return (
    <div className="m-6 flex flex-col gap-6">
      {/* Header card */}
      <div className="bg-card border border-border rounded-xl p-6 flex justify-between items-center gap-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex items-end max-w-max">
            <Avatar className="size-20 ring-2 ring-primary ring-offset-2">
              <AvatarImage src={avatarSrc} alt={user?.username} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
            <span className="bg-primary ring-2 ring-card absolute rounded-full size-3 right-0 bottom-2" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="uppercase font-bold text-foreground">{user?.username}</Label>
            <div className="flex flex-wrap gap-1">
              {user?.groups?.map((group) => (
                <span key={group.id} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                  {group.name}
                </span>
              ))}
            </div>
            <Label className="text-muted-foreground text-sm">{user?.email}</Label>
          </div>
        </div>
        <PermissionGuard permission="change_user">
          <Button onClick={() => setChangePassword(true)} aria-label={t("change_password")}>
            <Key className="size-4" />
            {t("change_password")}
          </Button>
        </PermissionGuard>
      </div>

      <div className="flex flex-col gap-4">
        {/* Personal info */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{t("personalInformation")}</Label>
            <PermissionGuard permission="change_user">
              {isUpdate ? editButtons : (
                <Button onClick={() => setIsUpdate(true)} aria-label={t("edit")}>
                  <Edit className="size-4" />
                  {t("edit")}
                </Button>
              )}
            </PermissionGuard>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("username")}</Label>
              <span className="text-foreground font-medium">{user?.username}</span>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("last_name")}</Label>
              {isUpdate ? (
                <Input value={userData.last_name} onChange={(e) => setUserData({ ...userData, last_name: e.target.value })} />
              ) : (
                <span className="text-foreground font-medium uppercase">{user?.last_name}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("first_name")}</Label>
              {isUpdate ? (
                <Input value={userData.first_name} onChange={(e) => setUserData({ ...userData, first_name: e.target.value })} />
              ) : (
                <span className="text-foreground font-medium">{user?.first_name}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("phone_number")}</Label>
              {isUpdate ? (
                <Input value={userData.phone_number} onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })} />
              ) : (
                <span className="text-foreground font-medium">{user?.phone_number}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("email")}</Label>
              {isUpdate ? (
                <Input value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
              ) : (
                <span className="text-foreground font-medium">{user?.email}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("level")}</Label>
              <span className="text-foreground font-medium">{user?.level}</span>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">{t("role")}</Label>
              <span className="text-foreground font-medium">
                {user?.groups && user.groups.length > 0 ? user.groups.map((g) => g.name).join(", ") : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Other info */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <Label className="text-base font-semibold">{t("otherInformation")}</Label>
          <Separator />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Checkbox checked={user?.is_superuser} />
              <Label>{t("is_superuser")}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={user?.is_active} />
              <Label>{t("is_active")}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={user?.is_editor} />
              <Label>{t("is_editor")}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={user?.is_staff} />
              <Label>{t("is_staff")}</Label>
            </div>
          </div>
        </div>

        {/* Groups */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <Label className="text-base font-semibold">{t("rule")} ({user?.groups?.length ?? 0})</Label>
          <Separator />
          <div className="flex flex-wrap gap-2">
            {user?.groups?.map((group) => (
              <div key={group.id} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                <CheckCheck className="size-4 text-primary" />
                <span className="text-sm text-foreground">{group.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <Label className="text-base font-semibold">{t("permissionList")} ({allPermissions.length})</Label>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {allPermissions.map((perm) => (
              <div key={perm?.id ?? perm?.codename} className="flex items-center gap-2">
                <PencilRuler className="size-3.5 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground">{perm.codename}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change password dialog */}
      <Dialog open={changePassword} onOpenChange={setChangePassword}>
        <DialogTrigger asChild />
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("change_password")}</DialogTitle>
            <DialogDescription>{t("change_password_description")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("old_password")}</Label>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("old_password")}
                  value={password.old_password}
                  onChange={(e) => setPassword({ ...password, old_password: e.target.value })}
                />
                {showPassword ? (
                  <EyeOff onClick={() => setShowPassword(false)} className="size-4 absolute right-2 cursor-pointer text-muted-foreground" />
                ) : (
                  <Eye onClick={() => setShowPassword(true)} className="size-4 absolute right-2 cursor-pointer text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("new_password")}</Label>
              <Input
                type="password"
                placeholder={t("new_password")}
                value={password.new_password}
                onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("confirm_password")}</Label>
              <Input
                type="password"
                placeholder={t("confirm_password")}
                value={password.confirm_password}
                onChange={(e) => setPassword({ ...password, confirm_password: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel}>{t("cancel")}</Button>
            <Button onClick={handleChangePassword} disabled={isLoadingPassword}>
              {isLoadingPassword ? <Loader className="animate-spin size-4 mr-2" /> : null}
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileContentPage;
