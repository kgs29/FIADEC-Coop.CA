import UrlGuard from "@/lib/UrlGuard";
import RoleForm from "../form";

const AddRolePage = () => {
  return (
    <UrlGuard permission="add_group">
      <div className="m-auto p-7 bg-white mt-10">
        <RoleForm />
      </div>
    </UrlGuard>
  );
};

export default AddRolePage;
