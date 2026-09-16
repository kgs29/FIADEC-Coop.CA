"use client";
import { FormModal } from "@/components/modals/FormModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProjectCategoryMutation,
  useUpdateProjectCategoryMutation,
} from "@/store/apis/core/project.api";
import { ProjectCategory } from "@/types/project.types";
import { useNavigateBack } from "@/utils/navigate-back";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof CategorySchema>;

interface CategoryFormProps {
  initial?: ProjectCategory;
  id?: string;
  isUpdate?: boolean;
}

const CategoryForm = ({ initial, id, isUpdate }: CategoryFormProps) => {
  const { t } = useTranslation();
  const navigateBack = useNavigateBack();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initial
      ? { name: initial.name, description: initial.description, is_active: initial.is_active }
      : { is_active: true },
  });

  const [createCategory, { isLoading: isCreating }] = useCreateProjectCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateProjectCategoryMutation();
  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      if (isUpdate && id) {
        await updateCategory({ id, data: values }).unwrap();
        toast.success(t("updated_successfully"));
      } else {
        await createCategory(values).unwrap();
        toast.success(t("created_successfully"));
      }
      navigateBack();
    } catch {
      toast.error(t("an_error_occurred"));
    }
  };

  return (
    <Form {...form}>
      <FormModal
        isOpen={true}
        onClose={navigateBack}
        title={isUpdate ? t("edit_category", "Modifier la catégorie") : t("create_category", "Ajouter une catégorie")}
        onSubmit={form.handleSubmit(handleSubmit)}
        isLoading={isLoading}
        maxWidth="max-w-xl"
      >
        <div className="grid gap-4 my-4">
          <FormField name="name" control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("name")}</FormLabel>
                <FormControl><Input placeholder={t("category_name_placeholder")} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField name="description" control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
                <FormControl><Textarea placeholder={t("description_placeholder")} rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField name="is_active" control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <Label>{t("category_active")}</Label>
              </FormItem>
            )}
          />
        </div>
      </FormModal>
    </Form>
  );
};

export default CategoryForm;
