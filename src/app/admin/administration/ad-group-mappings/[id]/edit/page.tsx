"use client";
import UrlGuard from "@/lib/UrlGuard";
import { useGetSingleADGroupMappingQuery } from "@/store/apis/auth/authentication.api";
import { useParams } from "next/navigation";
import ADGroupMappingForm from "../../form";

const EditADGroupMappingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: mapping, isFetching } = useGetSingleADGroupMappingQuery(id);

  let content: React.ReactNode = null;
  if (isFetching) {
    content = (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  } else if (mapping) {
    content = <ADGroupMappingForm initial={mapping} id={mapping.id} isUpdate />;
  }

  return (
    <UrlGuard permission="change_adgroupmapping">
      <div className="m-auto p-7 bg-white mt-10">
        {content}
      </div>
    </UrlGuard>
  );
};

export default EditADGroupMappingPage;
