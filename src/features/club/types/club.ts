import type { KeyFigure } from "@/types/content";

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
  values: string[];
  keyFigures: KeyFigure[];
};
