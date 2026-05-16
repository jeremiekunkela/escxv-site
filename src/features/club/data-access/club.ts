import club from "@/data/club.json";
import type { ClubInfo } from "@/features/club/types/club";

export function getClubInfo() {
  return club as ClubInfo;
}
