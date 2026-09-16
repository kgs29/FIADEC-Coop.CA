import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import DataSection from "./datasection";
import LinkSection from "./linksection";
import RulesStats from "./RulesStats";

const RulesHome = () => {
  return (
    <UrlGuard permission="view_group">
      <LinkSection />
      <StatsTabLayout statsPanel={<RulesStats />}>
        <DataSection />
      </StatsTabLayout>
    </UrlGuard>
  );
};

export default RulesHome;
