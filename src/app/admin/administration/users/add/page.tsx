import UrlGuard from "@/lib/UrlGuard";
import UserForm from "../form";

const AddPage = () => {
  return (
    <UrlGuard permission="add_user">
      <div className="py-6">
        <UserForm />
      </div>
    </UrlGuard>
  );
};

export default AddPage;
