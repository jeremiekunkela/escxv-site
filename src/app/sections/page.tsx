import type { Metadata } from "next";
import { ActivityExplorer } from "@/features/activities/components/ActivityExplorer/ActivityExplorer";
import { getActivities } from "@/features/activities/data-access/activities";
import { getHomepageContent } from "@/features/homepage/data-access/homepage";

const homepage = getHomepageContent();

export const metadata: Metadata = {
  title: "Sections",
  description: homepage.activitiesSection.subtitle,
};

export default function SectionsPage() {
  return (
    <main>
      <ActivityExplorer
        activities={getActivities()}
        eyebrow={homepage.activitiesSection.eyebrow}
        title={homepage.activitiesSection.title}
        subtitle={homepage.activitiesSection.subtitle}
      />
    </main>
  );
}
