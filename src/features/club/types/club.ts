import type { KeyFigure } from "@/types/content";

export type ClubPresentation = {
  tagline: string;
  paragraphs: string[];
};

export type ClubInfo = {
  name: string;
  shortName: string;
  address: string;
  postalCode: string;
  city: string;
  arrondissement: string;
  email: string | null;
  /**
   * Contact technique du site, distinct de l'adresse associative : une panne
   * d'affichage ou un lien casse n'a rien a faire dans la boite du
   * secretariat, qui traite les adhesions.
   */
  technicalEmail: string | null;
  foundedYear: number;
  approximateMemberCount: string;
  approximateActivityCount: number;
  description: string;
  presentation: ClubPresentation;
  values: string[];
  keyFigures: KeyFigure[];
};
