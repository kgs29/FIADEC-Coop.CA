import UrlGuard from "@/lib/UrlGuard";
import ADGroupMappingForm from "../form";

const AddADGroupMappingPage = () => {
  return (
    <UrlGuard permission="add_adgroupmapping">
      <div className="m-auto p-7 bg-white mt-10">
        <ADGroupMappingForm />
      </div>
    </UrlGuard>
  );
};

export default AddADGroupMappingPage;
