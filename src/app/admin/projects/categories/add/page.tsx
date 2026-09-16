"use client";
import UrlGuard from "@/lib/UrlGuard";
import CategoryForm from "../CategoryForm";
import { useTranslation } from "react-i18next";

const AddProjectCategoryPage = () => {
  const { t } = useTranslation();
  return (
    <UrlGuard permission="add_projectcategory">
      <div className="bg-white p-7 mt-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-6">{t("new_project_category")}</h1>
        <CategoryForm />
      </div>
    </UrlGuard>
  );
};

export default AddProjectCategoryPage;
