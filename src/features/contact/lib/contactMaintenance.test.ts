import { describe, expect, it } from "vitest";
import {
  buildInactiveContactText,
  isInactiveContactEmail,
} from "@/features/contact/lib/contactMaintenance";

describe("isInactiveContactEmail", () => {
  it("reconnait une boite fermee", () => {
    expect(isInactiveContactEmail("tennis@esc15.fr")).toBe(true);
  });

  it("ignore la casse et les espaces d'une saisie", () => {
    expect(isInactiveContactEmail("  Tennis@ESC15.fr ")).toBe(true);
  });

  it("laisse passer les boites ouvertes", () => {
    expect(isInactiveContactEmail("judo@esc15.fr")).toBe(false);
    expect(isInactiveContactEmail("contact@esc15.fr")).toBe(false);
  });
});

describe("buildInactiveContactText", () => {
  const clubEmail = "contact@esc15.fr";

  /**
   * Le formulaire reste ouvert : le message part au club, qui transmet. Dire
   * l'inverse ferait renoncer un visiteur qui pouvait ecrire.
   */
  it("oriente vers le formulaire, en disant ou le message atterrit", () => {
    const text = buildInactiveContactText({
      inactiveEmails: ["capoeira@esc15.fr"],
      isFormAvailable: true,
      clubEmail,
    });

    expect(text).toContain("L'adresse capoeira@esc15.fr n'est pas encore ouverte");
    expect(text).toContain("Utilisez le formulaire");
    expect(text).toContain("secrétariat du club");
    expect(text).not.toContain("désactivé");
  });

  it("accorde la phrase au pluriel quand la section a deux boites fermees", () => {
    const text = buildInactiveContactText({
      inactiveEmails: ["tennis@esc15.fr", "tennis-competition@esc15.fr"],
      isFormAvailable: true,
      clubEmail,
    });

    expect(text).toContain("Les adresses");
    expect(text).toContain("ne sont pas encore ouvertes");
    expect(text).toContain("qui leur sont adressés");
  });

  it("renvoie vers le club quand le formulaire n'est pas disponible", () => {
    const text = buildInactiveContactText({
      inactiveEmails: ["capoeira@esc15.fr"],
      isFormAvailable: false,
      clubEmail,
    });

    expect(text).toContain(clubEmail);
    expect(text).not.toContain("Utilisez le formulaire");
  });

  it("ne promet aucune adresse quand le club n'en a pas", () => {
    const text = buildInactiveContactText({
      inactiveEmails: ["capoeira@esc15.fr"],
      isFormAvailable: false,
      clubEmail: null,
    });

    expect(text).not.toContain("Écrivez au club");
    expect(text).toContain("n'arrivent pas.");
  });
});
