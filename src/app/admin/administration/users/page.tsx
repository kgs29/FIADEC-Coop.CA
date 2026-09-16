import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import DataSection from "./datasection";
import LinkSection from "./linksection";
import UsersStats from "./UsersStats";

const UserHome = () => {
  return (
    <UrlGuard permission="view_user">
      <div>
        <LinkSection />
        <StatsTabLayout statsPanel={<UsersStats />}>
          <DataSection />
        </StatsTabLayout>
      </div>
    </UrlGuard>
  );
};

export default UserHome;
