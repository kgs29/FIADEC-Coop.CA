import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import ProjectDataSection from "./ProjectDataSection";
import ProjectLinkSection from "./ProjectLinkSection";
import ProjectsStats from "./ProjectsStats";

const ProjectsPage = () => {
  return (
    <UrlGuard permission="view_project">
      <div>
        <ProjectLinkSection />
        <StatsTabLayout statsPanel={<ProjectsStats />}>
          <ProjectDataSection />
        </StatsTabLayout>
      </div>
    </UrlGuard>
  );
};

export default ProjectsPage;
