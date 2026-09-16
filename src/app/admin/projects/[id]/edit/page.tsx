"use client";
import UrlGuard from "@/lib/UrlGuard";
import { useGetProjectQuery } from "@/store/apis/core/project.api";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";

import ProjectForm from "../../ProjectForm";

const EditProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useGetProjectQuery(id);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <UrlGuard permission="change_project">
      <div className="py-6">
        <ProjectForm initial={project} id={id} isUpdate />
      </div>
    </UrlGuard>
  );
};

export default EditProjectPage;
