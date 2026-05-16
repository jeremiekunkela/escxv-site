import type { Metadata } from "next";
import { ContactPage } from "@/features/club/components/ContactPage/ContactPage";
import { getClubInfo } from "@/features/club/data-access/club";

const club = getClubInfo();

export const metadata: Metadata = {
  title: "Contact",
  description: `Coordonnees de ${club.shortName}.`,
};

export default function ContactRoute() {
  return <ContactPage club={club} />;
}
