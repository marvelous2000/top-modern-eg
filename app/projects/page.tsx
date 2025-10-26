import { ProjectsPageClient } from "@/components/projects-page-client"
import { getProjects, type Project } from "@/lib/actions/projects"

export default async function ProjectsPage() {
  const result = await getProjects()
  const projects = (result.success ? (result.data as Project[]) : []) ?? []

  return <ProjectsPageClient projects={projects} />
}
