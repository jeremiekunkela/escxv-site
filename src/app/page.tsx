import type { Metadata } from "next";
import { routes } from "@/lib/constants/routes";
import { getActivities } from "@/features/activities/data-access/activities";
import { getClubInfo } from "@/features/club/data-access/club";
import { HomePageContent } from "@/features/homepage/components/HomePageContent/HomePageContent";
import { getHomepageContent } from "@/features/homepage/data-access/homepage";
import { getGlobalNews } from "@/features/news/data-access/news";
import { JsonLd } from "@/components/shared/JsonLd/JsonLd";
import { buildSportsClubSchema } from "@/lib/seo/structuredData";

const club = getClubInfo();

export const metadata: Metadata = {
  description: club.description,
  alternates: { canonical: routes.home },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildSportsClubSchema(club)} />
      <HomePageContent
        homepage={getHomepageContent()}
        club={club}
        activities={getActivities()}
        news={getGlobalNews()}
      />
    </>
  );
}
