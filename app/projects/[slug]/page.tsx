import type { Metadata } from "next"
import { projects } from "@/lib/projects"
import { ProjectPageClient } from "./page.client"

type ProjectPageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = projects[params.slug]

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

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects[params.slug]

  return <ProjectPageClient project={project} slug={params.slug} />
}

