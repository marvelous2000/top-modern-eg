import type { Metadata } from "next"
import { getProjectBySlug } from "@/lib/actions/projects"
import { ProjectPageClient } from "./page.client"

type ProjectPageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { data: project } = await getProjectBySlug((await params).slug)

  if (!project) {
    return {
      title: "Project Not Found - Top Modern",
    }
  }

  return {
    title: `${project.title} - Top Modern | ${project.category} Project`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { data: project } = await getProjectBySlug((await params).slug)

  return <ProjectPageClient project={project ?? undefined} slug={(await params).slug} />
}
