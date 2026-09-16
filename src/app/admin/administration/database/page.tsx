import UrlGuard from "@/lib/UrlGuard";
import DatabaseContent from "./database-content";

const DatabasePage = () => {
  return (
    <UrlGuard permission="add_logentry">
      <DatabaseContent />
    </UrlGuard>
  );
};

export default DatabasePage;
