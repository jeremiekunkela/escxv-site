import homepage from "@/data/homepage.json";
import type { HomepageContent } from "@/features/homepage/types/homepage";

export function getHomepageContent() {
  return homepage as HomepageContent;
}
