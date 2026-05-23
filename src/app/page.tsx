import type { Metadata } from "next";
import { getActivities } from "@/features/activities/data-access/activities";
import { getClubInfo } from "@/features/club/data-access/club";
import { HomePageContent } from "@/features/homepage/components/HomePageContent/HomePageContent";
import { getHomepageContent } from "@/features/homepage/data-access/homepage";
import { getGlobalNews } from "@/features/news/data-access/news";

const club = getClubInfo();

export const metadata: Metadata = {
  title: "Accueil",
  description: club.description,
};

export default function HomePage() {
  return (
    <HomePageContent
      homepage={getHomepageContent()}
      club={club}
      activities={getActivities()}
      news={getGlobalNews()}
    />
  );
}
