import governance from "@/data/governance.json";
import type { Governance } from "@/features/club/types/governance";

export function getGovernance() {
  return governance as Governance;
}
