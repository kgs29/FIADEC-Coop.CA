"use client";
import UrlGuard from "@/lib/UrlGuard";
import { useGetProjectCategoryQuery } from "@/store/apis/core/project.api";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import CategoryForm from "../../CategoryForm";

const EditProjectCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading } = useGetProjectCategoryQuery(id);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <UrlGuard permission="change_projectcategory">
      <div className="bg-white p-7 mt-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-6">Modifier la catégorie</h1>
        <CategoryForm initial={category} id={id} isUpdate />
      </div>
    </UrlGuard>
  );
};

export default EditProjectCategoryPage;
