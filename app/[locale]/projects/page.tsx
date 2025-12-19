
import { getActiveProjects } from "@/lib/actions/projects";
import { ProjectsPageClient } from "@/components/projects-page-client";
// translations are handled client-side in the Projects client component
import { PageTransition } from "@/components/ui/page-transition";

export default async function ProjectsPage({
  params,
}: {
  params: { locale: string };
}) {
  const projectsResult = await getActiveProjects();

  if (!projectsResult.success) {
    console.error("Failed to fetch projects:", projectsResult.error);
    // You can render an error state here if you want
  }

  const projects = projectsResult.data || [];

  return (
    <PageTransition>
      <ProjectsPageClient projects={projects} locale={params.locale} />
    </PageTransition>
  );
}
