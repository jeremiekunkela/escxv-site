import governance from "@/data/governance.json";
import type { Governance } from "@/features/club/types/governance";

export function getGovernance() {
  return governance as Governance;
}

/**
 * Le directeur de la publication d'un site associatif est, sauf designation
 * contraire, le representant legal de l'association. On le derive donc du
 * bureau plutot que de l'ecrire : une page a valeur juridique ne doit pas
 * nommer un ancien president apres une assemblee generale.
 *
 * Le titre doit correspondre exactement : le bureau compte aussi des
 * presidents d'honneur, qui ne representent pas l'association.
 */
export function getPublicationDirector() {
  return getGovernance().bureau.find(
    (member) => member.role.toLowerCase() === "président",
  );
}
