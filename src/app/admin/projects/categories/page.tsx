"use client";
import UrlGuard from "@/lib/UrlGuard";
import { useState } from "react";
import CategoriesStats from "./CategoriesStats";
import CategoryDataSection from "./CategoryDataSection";
import CategoryLinkSection from "./CategoryLinkSection";

const ProjectCategoriesPage = () => {
  const [filterQuery, setFilterQuery] = useState("");

  return (
    <UrlGuard permission="view_projectcategory">
      <div className="space-y-4">
        <CategoryLinkSection />
        <CategoriesStats filterQuery={filterQuery} />
        <CategoryDataSection onFiltersChange={setFilterQuery} externalSearch={filterQuery} />
      </div>
    </UrlGuard>
  );
};

export default ProjectCategoriesPage;
