import type { Metadata } from "next";
import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { InstallationsExplorer } from "@/features/activities/components/InstallationsExplorer/InstallationsExplorer";
import { getInstallations } from "@/features/activities/data-access/activities";

const installations = getInstallations();

/**
 * Comptes derives plutot qu'ecrits : la description de recherche ne peut pas
 * annoncer douze lieux le jour ou le registre en accueille un treizieme.
 */
const spaceCount = installations.reduce(
  (total, installation) => total + installation.spaces.length,
  0,
);

export const metadata: Metadata = {
  title: "Lieux de pratique",
  description: `Les ${installations.length} gymnases, stades et piscines où s'entraînent les sections de l'ESCXV, et les sports pratiqués dans chacun de leurs ${spaceCount} espaces.`,
};

export default function LieuxPage() {
  return (
    <>
      <HeroSection
        eyebrow="Lieux de pratique"
        title="Où pratiquer à l'ESCXV"
        description={`${installations.length} équipements, presque tous dans le 15e arrondissement. Cherchez par nom, par adresse ou par sport pour savoir où se déroule votre activité.`}
        imageUrl="https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1800&q=80"
      />

      <main>
        <InstallationsExplorer installations={installations} />
      </main>
    </>
  );
}
