import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/actions/projects";
import ProjectPageClient from "./page.client";
import { PageTransition } from "@/components/ui/page-transition";

type ProjectPageProps = {
  params: { slug: string; locale: string };
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { data: project } = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found - Top Modern",
    };
  }

  return {
    title: `${project.title} - Top Modern | ${project.category} Project`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { data: project } = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <PageTransition>
      <ProjectPageClient project={project} slug={params.slug} locale={params.locale} />
    </PageTransition>
  );
}
