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
  phone: string;
  email: string | null;
  foundedYear: number;
  approximateMemberCount: string;
  approximateActivityCount: number;
  description: string;
  presentation: ClubPresentation;
  values: string[];
  keyFigures: KeyFigure[];
};
