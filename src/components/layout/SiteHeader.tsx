import { getNavigationContent } from "@/features/navigation/data-access/navigation";
import { SiteHeaderClient } from "./SiteHeaderClient";

export function SiteHeader() {
  return <SiteHeaderClient navigation={getNavigationContent()} />;
}
