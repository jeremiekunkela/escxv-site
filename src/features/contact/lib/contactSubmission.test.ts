import { describe, expect, it } from "vitest";
import { buildContactMessage } from "@/features/contact/lib/buildContactMessage";
import { parseContactRequest } from "@/features/contact/lib/parseContactRequest";
import type { ContactRequest } from "@/features/contact/types/contact";

const validPayload = {
  recipientSlug: "contact-tennis",
  name: "Camille Durand",
  email: "camille.durand@example.org",
  phone: "",
  subject: "cours-essai",
  message: "Bonjour, je souhaite essayer le tennis le samedi matin.",
};

const parseOrThrow = (payload: unknown): ContactRequest => {
  const parsed = parseContactRequest(payload);

  if (!parsed.ok) {
    throw new Error(`Demande refusee : ${parsed.violations.join(", ")}`);
  }

  return parsed.value;
};

describe("parseContactRequest", () => {
  it("accepte une demande complete", () => {
    expect(parseContactRequest(validPayload).ok).toBe(true);
  });

  it("refuse un message trop court", () => {
    expect(parseContactRequest({ ...validPayload, message: "court" }).ok).toBe(
      false,
    );
  });
});

describe("buildContactMessage — etiquettes du message", () => {
  const recipient = {
    email: "tennis@esc15.fr",
    label: "Tennis",
    reroutedFrom: null,
  };

  it("part en envoi normal, jamais en renvoi", () => {
    const message = buildContactMessage(parseOrThrow(validPayload), recipient);

    expect(message.metadata.deliveryType).toBe("primary");
  });

  it("emporte la section visee, pour qu'un rebond la nomme", () => {
    const message = buildContactMessage(parseOrThrow(validPayload), recipient);

    expect(message.metadata).toEqual({
      recipientSlug: "contact-tennis",
      deliveryType: "primary",
    });
  });

  it("ecrit au destinataire resolu, jamais a une adresse venue du navigateur", () => {
    const message = buildContactMessage(parseOrThrow(validPayload), recipient);

    expect(message.to).toBe("tennis@esc15.fr");
  });

  it("met l'adresse du visiteur en reponse, pour qu'on puisse lui ecrire", () => {
    const message = buildContactMessage(parseOrThrow(validPayload), recipient);

    expect(message.replyTo).toBe("camille.durand@example.org");
  });

  /**
   * Le secretariat recoit un message qui ne lui etait pas destine : sans le
   * dire, il ressemble a une demande qui lui serait adressee.
   */
  it("dit au club d'ou vient un message deroute", () => {
    const message = buildContactMessage(parseOrThrow(validPayload), {
      email: "contact@esc15.fr",
      label: "Tennis",
      reroutedFrom: "tennis@esc15.fr",
    });

    expect(message.to).toBe("contact@esc15.fr");
    expect(message.text).toContain("visait tennis@esc15.fr");
    expect(message.html).toContain("tennis@esc15.fr");
    expect(message.subject).toContain("[Tennis]");
  });

  it("ne dit rien de tel pour un envoi qui atteint sa section", () => {
    const message = buildContactMessage(parseOrThrow(validPayload), recipient);

    expect(message.text).not.toContain("visait");
  });
});
