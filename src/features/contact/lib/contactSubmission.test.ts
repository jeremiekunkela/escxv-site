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

describe("parseContactRequest — choix de renvoi", () => {
  it("refuse le renvoi quand la demande n'en dit rien, quoi qu'affiche le formulaire", () => {
    expect(parseOrThrow(validPayload).allowFallback).toBe(false);
  });

  it("retient l'acceptation donnee en clair", () => {
    expect(
      parseOrThrow({ ...validPayload, allowFallback: true }).allowFallback,
    ).toBe(true);
  });

  it("n'accepte qu'un vrai booleen : un consentement ne se deduit pas", () => {
    ["true", "on", 1, "1", {}, []].forEach((value) => {
      expect(
        parseOrThrow({ ...validPayload, allowFallback: value }).allowFallback,
      ).toBe(false);
    });
  });

  it("laisse le reste de la validation inchange", () => {
    const refused = parseContactRequest({
      ...validPayload,
      message: "court",
      allowFallback: true,
    });

    expect(refused.ok).toBe(false);
  });
});

describe("buildContactMessage — etiquettes du message", () => {
  const recipient = { email: "tennis@esc15.fr", label: "Tennis" };

  it("part en envoi normal, jamais en renvoi", () => {
    const message = buildContactMessage(parseOrThrow(validPayload), recipient);

    expect(message.metadata.deliveryType).toBe("primary");
  });

  it("emporte le choix du visiteur et la section visee", () => {
    const message = buildContactMessage(
      parseOrThrow({ ...validPayload, allowFallback: true }),
      recipient,
    );

    expect(message.metadata).toEqual({
      recipientSlug: "contact-tennis",
      allowFallback: true,
      deliveryType: "primary",
    });
  });

  it("ecrit a la section, pas a l'adresse de repli", () => {
    const message = buildContactMessage(
      parseOrThrow({ ...validPayload, allowFallback: true }),
      recipient,
    );

    expect(message.to).toBe("tennis@esc15.fr");
  });

  it("met l'adresse du visiteur en reponse, pour qu'on puisse lui ecrire", () => {
    const message = buildContactMessage(parseOrThrow(validPayload), recipient);

    expect(message.replyTo).toBe("camille.durand@example.org");
  });
});
