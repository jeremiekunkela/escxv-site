import type { Metadata } from "next";
import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { InstallationsExplorer } from "@/features/activities/components/InstallationsExplorer/InstallationsExplorer";
import { getInstallations } from "@/features/activities/data-access/activities";

export const metadata: Metadata = {
  title: "Installations",
  description:
    "Les installations sportives de l'ESC XV dans le 15e arrondissement de Paris : gymnases, stades, piscines et salles, avec les sports pratiques sur chaque site.",
};

export default function InstallationsPage() {
  return (
    <>
      <HeroSection
        eyebrow="Installations"
        title="Les lieux de pratique du club"
        description="Gymnases, stades, piscines et salles : retrouvez toutes les installations de l'ESC XV dans le 15e arrondissement, les sports pratiques sur chaque site et leur equipement."
        imageUrl="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1800&q=80"
        primaryCta={{ label: "Voir les installations", href: "#installations" }}
        badges={["Paris 15e", "Gymnases", "Stades", "Piscines"]}
      />
      <main id="installations">
        <InstallationsExplorer installations={getInstallations()} />
      </main>
    </>
  );
}
