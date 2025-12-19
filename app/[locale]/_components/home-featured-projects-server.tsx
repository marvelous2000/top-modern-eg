// app/[locale]/_components/home-featured-projects-server.tsx
import { getFeaturedProjects } from "@/lib/actions/projects";
import type { Project } from "@/lib/actions/projects";
import FeaturedProjectsCarouselClient from "./featured-projects-carousel-client";

interface HomeFeaturedProjectsServerProps {
  currentLocale: string;
}

export default async function HomeFeaturedProjectsServer({ currentLocale }: HomeFeaturedProjectsServerProps) {
  const result = await getFeaturedProjects();
  const featuredProjects: Project[] = result.success ? (result.data || []) : [];

  if (result.error) {
    console.error("Failed to fetch featured projects in HomeFeaturedProjectsServer:", result.error);
    // Optionally render an error state or an empty carousel
    return <div className="text-center text-red-500 py-10">Error loading featured projects.</div>;
  }

  return (
    <FeaturedProjectsCarouselClient projects={featuredProjects} currentLocale={currentLocale} />
  );
}
