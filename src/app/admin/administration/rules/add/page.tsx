import UrlGuard from "@/lib/UrlGuard";
import RuleForm from "../form";

const AddRulePage = () => {
  return (
    <UrlGuard permission="add_group">
      <div className="m-auto p-7 bg-white mt-10">
        <RuleForm />
      </div>
    </UrlGuard>
  );
};

export default AddRulePage;
