"use client";
import { PageForm } from "@/components/forms/PageForm";
import Editor from "@/components/editor-component";
import ProjectCategoryFormModal from "@/components/modals/ProjectCategoryFormModal";
import { Checkbox } from "@/components/ui/checkbox";
import ComboboxField from "@/components/ui/ComboboxField";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProjectMutation,
  useGetProjectCategoriesQuery,
  useUpdateProjectMutation,
} from "@/store/apis/core/project.api";
import { ProjectCategory, ProjectDetail } from "@/types/project.types";
import { useNavigateBack } from "@/utils/navigate-back";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const ProjectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Le contenu est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  status: z.enum(["draft", "published", "archived"]).optional(),
  is_featured: z.boolean().optional(),
  technologies: z.string().optional(),
  demo_url: z.string().url("URL invalide").optional().or(z.literal("")),
  repository_url: z.string().url("URL invalide").optional().or(z.literal("")),
  difficulty_level: z.enum(["beginner", "intermediate", "advanced", "expert", ""]).optional(),
  price: z.string().optional(),
  is_purchasable: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof ProjectSchema>;

interface ProjectFormProps {
  initial?: ProjectDetail;
  id?: string;
  isUpdate?: boolean;
}

const ProjectForm = ({ initial, id, isUpdate }: ProjectFormProps) => {
  const { t } = useTranslation();
  const navigateBack = useNavigateBack();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: initial
      ? {
          title: initial.title,
          excerpt: initial.excerpt,
          content: initial.content,
          category: initial.category,
          status: initial.status,
          is_featured: initial.is_featured,
          technologies: initial.technologies,
          demo_url: initial.demo_url,
          repository_url: initial.repository_url,
          difficulty_level: initial.difficulty_level || "",
          price: initial.price ?? "",
          is_purchasable: initial.is_purchasable,
        }
      : { status: "draft", is_featured: false, is_purchasable: false, difficulty_level: "intermediate" },
  });

  const { data: categoriesData } = useGetProjectCategoriesQuery("size=200");
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (values: ProjectFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("category", values.category);
    if (values.excerpt) formData.append("excerpt", values.excerpt);
    if (values.status) formData.append("status", values.status);
    formData.append("is_featured", String(values.is_featured ?? false));
    formData.append("is_purchasable", String(values.is_purchasable ?? false));
    if (values.technologies) formData.append("technologies", values.technologies);
    if (values.demo_url) formData.append("demo_url", values.demo_url);
    if (values.repository_url) formData.append("repository_url", values.repository_url);
    if (values.difficulty_level) formData.append("difficulty_level", values.difficulty_level);
    if (values.price) formData.append("price", values.price);
    const file = fileRef.current?.files?.[0];
    if (file) formData.append("cover_image", file);

    try {
      if (isUpdate && id) {
        await updateProject({ id, data: formData }).unwrap();
        toast.success(t("updated_successfully"));
      } else {
        await createProject(formData).unwrap();
        toast.success(t("created_successfully"));
      }
      navigateBack();
    } catch {
      toast.error(t("an_error_occurred"));
    }
  };

  const handleCategoryCreated = (cat: ProjectCategory) => {
    form.setValue("category", cat.id);
    setCategorySearch(cat.name);
  };

  const watchIsPurchasable = form.watch("is_purchasable");

  return (
    <>
      <Form {...form}>
        <PageForm
          title={isUpdate ? t("edit_project", "Modifier le projet") : t("create_project", "Ajouter un projet")}
          onSubmit={form.handleSubmit(handleSubmit)}
          onCancel={navigateBack}
          isLoading={isLoading}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Titre */}
            <FormField name="title" control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t("project_title")}</FormLabel>
                  <FormControl><Input placeholder={t("project_title")} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Catégorie */}
            <ComboboxField
              form={form}
              name="category"
              label={t("category")}
              required
              placeholder={t("select_category")}
              options={(categoriesData?.results ?? []).map((cat) => ({ id: cat.id, libelle: cat.name }))}
              search={categorySearch}
              setSearch={setCategorySearch}
              onCreateNew={(name) => { setCategorySearch(name); setShowCategoryModal(true); }}
            />

            {/* Statut */}
            <FormField name="status" control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status")}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full"><SelectValue placeholder={t("status")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t("draft")}</SelectItem>
                        <SelectItem value="published">{t("published")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Niveau de difficulté */}
            <FormField name="difficulty_level" control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("difficulty_level")}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full"><SelectValue placeholder={t("level")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">{t("beginner")}</SelectItem>
                        <SelectItem value="intermediate">{t("intermediate")}</SelectItem>
                        <SelectItem value="advanced">{t("advanced")}</SelectItem>
                        <SelectItem value="expert">{t("expert")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Technologies */}
            <FormField name="technologies" control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("technologies")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("technologies_placeholder")} {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">{t("technologies_hint")}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image de couverture */}
            <div className="flex flex-col gap-2">
              <Label>{t("cover_image")}</Label>
              <Input type="file" accept="image/*" ref={fileRef} />
              {initial?.cover_image && (
                <Image src={initial.cover_image} alt="cover" width={80} height={80} className="rounded object-cover" />
              )}
            </div>

            {/* URL démo */}
            <FormField name="demo_url" control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("demo_url")}</FormLabel>
                  <FormControl><Input placeholder="https://demo.example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL dépôt */}
            <FormField name="repository_url" control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("repository_url")}</FormLabel>
                  <FormControl><Input placeholder="https://github.com/…" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Résumé */}
            <div className="xl:col-span-2">
              <FormField name="excerpt" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("excerpt")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("excerpt_placeholder")} rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contenu */}
            <div className="xl:col-span-2">
              <FormField name="content" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t("detailed_description")}</FormLabel>
                    <FormControl>
                      <div className="min-h-[300px]">
                        <Editor value={field.value} placeholder={t("description_placeholder")} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Options */}
            <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name="is_featured" control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 rounded-md border p-4">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <Label>{t("featured_project")}</Label>
                  </FormItem>
                )}
              />
              <FormField name="is_purchasable" control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 rounded-md border p-4">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <Label>{t("paid_project")}</Label>
                  </FormItem>
                )}
              />
            </div>

            {/* Prix (visible seulement si is_purchasable) */}
            {watchIsPurchasable && (
              <FormField name="price" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t("price_xof")}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="100" placeholder={t("price_placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </PageForm>
      </Form>

      {showCategoryModal && (
        <ProjectCategoryFormModal
          defaultName={categorySearch}
          onCreated={handleCategoryCreated}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </>
  );
};

export default ProjectForm;
