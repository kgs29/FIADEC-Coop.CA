"use client";
import UrlGuard from "@/lib/UrlGuard";
import ProjectForm from "../ProjectForm";


const AddProjectPage = () => {
  return (
    <UrlGuard permission="add_project">
      <div className="py-6">
        <ProjectForm />
      </div>
    </UrlGuard>
  );
};

export default AddProjectPage;
