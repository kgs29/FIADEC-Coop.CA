"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProjectCategoryMutation } from "@/store/apis/core/project.api";
import { ProjectCategory } from "@/types/project.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FormValues = z.input<typeof schema>;

interface Props {
  defaultName?: string;
  onCreated: (category: ProjectCategory) => void;
  onClose: () => void;
}

export default function ProjectCategoryFormModal({ defaultName, onCreated, onClose }: Props) {
  const { t } = useTranslation();
  const [createCategory, { isLoading }] = useCreateProjectCategoryMutation();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName ?? "", description: "", is_active: true },
  });

  useEffect(() => {
    if (defaultName) setValue("name", defaultName);
  }, [defaultName, setValue]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      const cat = await createCategory({
        name: values.name,
        description: values.description ?? "",
        is_active: values.is_active,
      }).unwrap();
      toast.success(t("category_created_success", { name: cat.name }));
      onCreated(cat);
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { name?: string[]; detail?: string } };
      const msg = e?.data?.name?.[0] ?? e?.data?.detail ?? t("create_error");
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{t("new_project_category")}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name" className="text-sm font-medium">
              Nom <span className="text-destructive">*</span>
            </Label>
            <Input id="cat-name" placeholder={t("category_name_example")} autoFocus {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc" className="text-sm font-medium">{t("description")}</Label>
            <Textarea id="cat-desc" placeholder={t("optional_description_placeholder")} rows={3} {...register("description")} />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="cat-active" defaultChecked {...register("is_active")} className="h-4 w-4 rounded border-border accent-primary" />
            <Label htmlFor="cat-active" className="text-sm font-medium cursor-pointer">{t("category_active")}</Label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>{t("cancel")}</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              {t("create_category")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
