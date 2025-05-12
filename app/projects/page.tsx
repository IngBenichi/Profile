import { getPortfolioData } from "@/lib/data";
import ProjectCard from "@/components/project-card";

export default async function ProjectsPage() {
  const data = await getPortfolioData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            role={project.role}
            description={project.description}
            technologies={project.technologies}
            features={project.features}
            githubUrl={project.githubUrl}
            demoUrl={project.demoUrl}
            imageUrl={project.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
