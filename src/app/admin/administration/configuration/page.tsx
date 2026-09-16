import UrlGuard from "@/lib/UrlGuard";
import ConfigurationContent from "./configuration-content";

const ConfigurationPage = () => {
  return (
    <UrlGuard permission="add_logentry">
      <ConfigurationContent />
    </UrlGuard>
  );
};

export default ConfigurationPage;
