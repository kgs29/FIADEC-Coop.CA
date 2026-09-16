"use client";

import { PageForm } from "@/components/forms/PageForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { handleApiError } from "@/lib/handleApiError";
import { hashPassword } from "@/lib/hashPassword";
import {
  useCreateUserMutation,
  useGetRolesQuery,
  useResetDefaultPasswordMutation,
  useUpdateUserMutation,
} from "@/store/apis/auth/authentication.api";
import { UserInterface } from "@/types/auth.types";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { useNavigateBack } from "@/utils/navigate-back";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Camera, KeyRound, RefreshCw, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

/* ── Schéma Zod ── */
export const UserFormSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  first_name: z.string().min(1, "Le prénom est requis"),
  email: z.string().min(1, "L'email est requis"),
  phone_number: z.string().min(9, "Le numéro est requis"),
  role_ids: z.array(z.string()).default([]),
  two_factor_enabled: z.boolean().default(false),
  captcha_enabled: z.boolean().default(false),
  profile_photo: z.instanceof(File).optional(),
  password: z.string().optional(),
  is_active: z.boolean().default(true),
  is_staff: z.boolean().default(false),
  is_superuser: z.boolean().default(false),
  is_editor: z.boolean().default(false),
});

type UserFormValues = z.input<typeof UserFormSchema>;

/* ── Helpers de validation (réduisent la complexité cognitive de handleSubmit) ── */

function validateEditorConflicts(
  isEditor: boolean,
  isStaff: boolean,
  isSuperuser: boolean,
): string | null {
  if (isEditor && isStaff) return "Un éditeur ne peut pas avoir le statut équipe.";
  if (isEditor && isSuperuser) return "Un éditeur ne peut pas être super-utilisateur.";
  return null;
}

function hasRequiredRole(
  isUpdate: boolean,
  isSuperuser: boolean,
  isEditor: boolean,
  roleIds: string[],
): boolean {
  return isUpdate || isSuperuser || isEditor || roleIds.length > 0;
}

function isPasswordValid(
  isUpdate: boolean,
  isEditor: boolean,
  isStaff: boolean,
  password: string | undefined,
): boolean {
  if (isUpdate || isEditor || isStaff) return true;
  return !!password && password.length >= 6;
}

async function buildPayload(values: UserFormValues): Promise<UserInterface> {
  const payload: UserInterface = {
    ...values,
    role_ids: values.role_ids ?? [],
  };
  if (payload.password) {
    payload.password = await hashPassword(payload.password);
  }
  if (values.is_editor || !payload.password) {
    delete payload.password;
  }
  return payload;
}

/* ── Composant upload photo ── */
type PhotoUploaderProps = Readonly<{
  value?: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string | null;
}>;

function PhotoUploader({ value, onChange, existingUrl }: PhotoUploaderProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
    return undefined;
  }, [value]);

  const preview = objectUrl ?? existingUrl ?? null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("only_images_accepted"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("image_too_large"));
      return;
    }
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const dropZoneClass = [
    "w-full cursor-pointer rounded-lg border-2 border-dashed px-4 py-3",
    "flex flex-col items-center gap-1 text-center transition-colors",
    dragging
      ? "border-primary bg-primary/5"
      : "border-border hover:border-primary hover:bg-muted/50",
  ].join(" ");

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Photo de profil"
              width={96}
              height={96}
              className="object-cover w-full h-full"
              unoptimized={!!value}
            />
          ) : (
            <Camera className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow hover:bg-destructive/80 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
      <button
        type="button"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={dropZoneClass}
      >
        <Upload className="h-5 w-5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Glissez une image ou{" "}
          <span className="text-primary font-medium">parcourez</span>
        </p>
        <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP · max 5 Mo</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}

/* ── Champ statut (card-style toggle) ── */
type StatusToggleProps = Readonly<{
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
  disabled?: boolean;
}>;

function StatusToggle({ id, checked, onChange, label, description, disabled }: StatusToggleProps) {
  const containerClass = [
    "flex items-start gap-3 rounded-md border p-4 cursor-pointer transition-colors",
    checked ? "border-primary/40 bg-primary/5" : "border-border bg-card",
    disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/40",
  ].join(" ");

  return (
    <label htmlFor={id} className={containerClass}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => !disabled && onChange(!!v)}
        disabled={disabled}
        className="mt-0.5 shrink-0"
      />
      <div className="space-y-0.5">
        <p className="text-sm font-medium leading-tight">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </label>
  );
}

/* ── Champ de sécurité réutilisable - élimine le code dupliqué 2FA / CAPTCHA ── */
type SecurityCheckboxFieldProps = Readonly<{
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}>;

function SecurityCheckboxField({
  id,
  checked,
  onChange,
  label,
  description,
}: SecurityCheckboxFieldProps) {
  return (
    <div className="flex flex-row items-center gap-3 rounded-md border border-border bg-card p-4">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(!!v)}
        className="h-4 w-4"
      />
      <div className="space-y-0.5">
        <label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

/* ══ Formulaire principal ══ */
type UserFormProps = Readonly<{
  initial?: UserInterface;
  id?: string;
  isUpdate?: boolean;
}>;

const UserForm = ({ initial, id, isUpdate }: UserFormProps) => {
  const { t } = useTranslation();
  const currentUser = useAppSelector((state) => state.auth.user);
  const isSuperuser = !!currentUser?.is_superuser;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: initial
      ? {
        ...initial,
        role_ids: initial.roles?.map((r) => String(r.id)) ?? [],
        profile_photo: undefined,
        password: "",
        is_active: initial.is_active ?? true,
        is_staff: initial.is_staff ?? false,
        is_superuser: initial.is_superuser ?? false,
        is_editor: initial.is_editor ?? false,
      }
      : {
        role_ids: [],
        two_factor_enabled: false,
        captcha_enabled: false,
        password: "",
        is_active: true,
        is_staff: false,
        is_superuser: false,
        is_editor: false,
      },
  });

  const watchIsEditor = !!form.watch("is_editor");
  const watchIsStaff = !!form.watch("is_staff");
  const watchIsSuperuser = !!form.watch("is_superuser");

  const { data: rolesData, isFetching: loadingRoles } = useGetRolesQuery("size=200");
  const router = useRouter();
  const navigateBack = useNavigateBack();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [resetDefaultPassword, { isLoading: resetting }] = useResetDefaultPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!id) return;
    try {
      await resetDefaultPassword(id).unwrap();
      toast.success(t("password_reset_success"));
    } catch (err) {
      handleApiError(err, router, t);
    }
  };

  const handleSubmit = async (values: UserFormValues) => {
    const isEditor = !!values.is_editor;
    const isStaff = !!values.is_staff;
    const isSubmittedAsSuperuser = !!values.is_superuser;

    const conflictMessage = validateEditorConflicts(isEditor, isStaff, isSubmittedAsSuperuser);
    if (conflictMessage) {
      toast.error(conflictMessage);
      return;
    }

    if (!hasRequiredRole(!!isUpdate, isSubmittedAsSuperuser, isEditor, values.role_ids ?? [])) {
      form.setError("role_ids", { message: "Au moins un rôle est requis" });
      return;
    }

    if (!isPasswordValid(!!isUpdate, isEditor, isStaff, values.password)) {
      form.setError("password", {
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
      return;
    }

    const payload = await buildPayload(values);

    if (isUpdate && id) {
      try {
        await updateUser({ data: payload, id }).unwrap();
        toast.success(t("user_updated_successfully"));
        navigateBack();
      } catch (err) {
        handleApiError(err, router, t);
      }
    } else {
      try {
        await createUser(payload).unwrap();
        toast.success(t("created_successfully"));
        navigateBack();
      } catch (err) {
        handleApiError(err, router, t);
      }
    }
  };

  const existingPhotoUrl =
    initial?.profile_photo && typeof initial.profile_photo === "string"
      ? initial.profile_photo
      : null;

  const rolesOptional = watchIsSuperuser || watchIsEditor;
  const passwordRequired = !isUpdate && !watchIsEditor && !watchIsStaff;

  const handleIsStaffChange = useCallback(
    (v: boolean) => {
      form.setValue("is_staff", v);
      if (v) form.setValue("is_editor", false);
    },
    [form],
  );

  const handleIsSuperuserChange = useCallback(
    (v: boolean) => {
      form.setValue("is_superuser", v);
      if (v) form.setValue("is_editor", false);
    },
    [form],
  );

  const handleIsEditorChange = useCallback(
    (v: boolean) => {
      form.setValue("is_editor", v);
      if (v) {
        form.setValue("is_staff", false);
        form.setValue("is_superuser", false);
        form.setValue("is_active", false);
      }
    },
    [form],
  );

  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  const toggleRole = useCallback(
    (roleId: string, selected: string[], onChange: (v: string[]) => void) => {
      const next = selected.includes(roleId)
        ? selected.filter((r) => r !== roleId)
        : [...selected, roleId];
      onChange(next);
    },
    [],
  );

  return (
    <Form {...form}>
      <PageForm
        title={isUpdate ? t("update_user", "Modifier l'utilisateur") : t("create_user", "Ajouter un utilisateur")}
        onSubmit={form.handleSubmit(handleSubmit)}
        onCancel={navigateBack}
        isLoading={isLoading}
      >
        <div className="grid xl:grid-cols-2 gap-4 grid-cols-1 my-4 items-start">

          {/* ── Photo ── */}
          <div className="xl:col-span-2">
            <FormField
              name="profile_photo"
              control={form.control}
              render={({ field }) => (
                <FormItem className="border border-border rounded-lg p-5 bg-card">
                  <FormLabel className="text-sm font-semibold mb-3 block">
                    Photo de profil{" "}
                    <span className="text-muted-foreground font-normal">(optionnel)</span>
                  </FormLabel>
                  <PhotoUploader
                    value={field.value instanceof File ? field.value : null}
                    onChange={field.onChange}
                    existingUrl={existingPhotoUrl}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ── Champs texte ── */}
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("username")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("username")} {...field} disabled={isUpdate} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="last_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("last_name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("last_name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="first_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("first_name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("first_name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("email")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("email")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="phone_number"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("phone_number")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("phone_number")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ── Statuts utilisateur ── */}
          <div className="xl:col-span-2">
            <p className="text-sm font-semibold mb-3">Statuts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                name="is_active"
                control={form.control}
                render={({ field }) => (
                  <StatusToggle
                    id="is_active"
                    checked={!!field.value}
                    onChange={field.onChange}
                    label="Actif"
                    description="Le compte est actif. L'utilisateur peut se connecter."
                    disabled={watchIsEditor}
                  />
                )}
              />
              <FormField
                name="is_staff"
                control={form.control}
                render={() => (
                  <StatusToggle
                    id="is_staff"
                    checked={watchIsStaff}
                    onChange={handleIsStaffChange}
                    label="Statut équipe"
                    description="Accès à l'interface d'administration. Un e-mail de création est envoyé."
                    disabled={watchIsEditor}
                  />
                )}
              />
              <FormField
                name="is_superuser"
                control={form.control}
                render={() => (
                  <StatusToggle
                    id="is_superuser"
                    checked={watchIsSuperuser}
                    onChange={handleIsSuperuserChange}
                    label="Super-utilisateur"
                    description={
                      isSuperuser
                        ? "Toutes les permissions sont accordées automatiquement."
                        : "Réservé aux super-utilisateurs."
                    }
                    disabled={watchIsEditor || !isSuperuser}
                  />
                )}
              />
              <FormField
                name="is_editor"
                control={form.control}
                render={() => (
                  <StatusToggle
                    id="is_editor"
                    checked={watchIsEditor}
                    onChange={handleIsEditorChange}
                    label="Éditeur"
                    description="Accès limité. Aucun mot de passe, aucun e-mail, connexion impossible."
                  />
                )}
              />
            </div>

            {watchIsEditor && (watchIsStaff || watchIsSuperuser) && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Un éditeur ne peut pas avoir le statut équipe ou super-utilisateur.</span>
              </div>
            )}
          </div>

          {/* ── Mot de passe ── */}
          {!watchIsEditor && !isUpdate && (
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={passwordRequired}>
                    Mot de passe
                    {watchIsStaff && (
                      <span className="ml-1 text-muted-foreground font-normal text-xs">
                        (optionnel - un lien sera envoyé par e-mail)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          passwordRequired
                            ? "Mot de passe (min. 6 caractères)"
                            : "Laisser vide pour utiliser le lien e-mail"
                        }
                        autoComplete="new-password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                      >
                        {showPassword ? "Masquer" : "Voir"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isUpdate && isSuperuser && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                Mot de passe
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetPassword}
                disabled={resetting}
                className="gap-2 self-start"
              >
                <RefreshCw className={["h-4 w-4", resetting ? "animate-spin" : ""].join(" ")} />
                Réinitialiser à «&nbsp;Default@2026&nbsp;»
              </Button>
              <p className="text-xs text-muted-foreground">
                Définit le mot de passe à la valeur par défaut.
              </p>
            </div>
          )}

          {/* ── Sécurité ── */}
          <FormField
            name="two_factor_enabled"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SecurityCheckboxField
                    id="two_factor_enabled"
                    checked={!!field.value}
                    onChange={field.onChange}
                    label="Double authentification (2FA)"
                    description="Un code OTP sera envoyé par e-mail à chaque connexion."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="captcha_enabled"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SecurityCheckboxField
                    id="captcha_enabled"
                    checked={!!field.value}
                    onChange={field.onChange}
                    label="CAPTCHA à la connexion"
                    description="Une question de vérification sera affichée à chaque connexion."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* ── Rôles ── */}
          <FormField
            name="role_ids"
            control={form.control}
            render={({ field }) => {
              const selected: string[] = field.value ?? [];
              const selectedRoles = rolesData?.results.filter((r) =>
                selected.includes(String(r.id)),
              );
              return (
                <FormItem className="xl:col-span-2">
                  <FormLabel required={!rolesOptional}>
                    {t("user_roles")}
                    {rolesOptional && (
                      <span className="ml-1 text-muted-foreground font-normal text-xs">
                        (optionnel)
                      </span>
                    )}
                  </FormLabel>
                  {selectedRoles && selectedRoles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selectedRoles.map((r) => (
                        <Badge
                          key={r.id}
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          {r.name}
                          <button
                            type="button"
                            onClick={() => toggleRole(String(r.id), selected, field.onChange)}
                            className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="border border-border rounded-md p-3 max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                    {loadingRoles ? (
                      <span className="text-sm text-muted-foreground col-span-full">
                        {t("loading")}
                      </span>
                    ) : (
                      rolesData?.results.map((role) => (
                        <label
                          key={role.id}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted px-2 py-1.5 rounded"
                        >
                          <Checkbox
                            checked={selected.includes(String(role.id))}
                            onCheckedChange={() =>
                              toggleRole(String(role.id), selected, field.onChange)
                            }
                          />
                          <span>{role.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </PageForm>
    </Form>
  );
};

export default UserForm;
