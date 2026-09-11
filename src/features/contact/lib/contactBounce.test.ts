import { describe, expect, it } from "vitest";
import {
  buildFallbackHtml,
  buildFallbackIdempotencyKey,
  buildFallbackSubject,
  buildFallbackText,
  decideBounceOutcome,
} from "@/features/contact/lib/contactBounce";

const primaryTags = {
  recipient: "contact-tennis",
  allow_fallback: "true",
  delivery_type: "primary",
};

describe("decideBounceOutcome", () => {
  it("renvoie quand le visiteur l'a autorise et que le message d'origine est retrouve", () => {
    expect(
      decideBounceOutcome({ tags: primaryTags, hasOriginalMessage: true }),
    ).toEqual({ action: "fallback" });
  });

  it("ne renvoie pas sans autorisation du visiteur", () => {
    const outcome = decideBounceOutcome({
      tags: { ...primaryTags, allow_fallback: "false" },
      hasOriginalMessage: true,
    });

    expect(outcome.action).toBe("alert-only");
    expect(outcome).toHaveProperty(
      "reason",
      expect.stringContaining("autorise"),
    );
  });

  it("traite toute valeur autre que « true » comme un refus", () => {
    ["", "1", "TRUE", "oui"].forEach((allow_fallback) => {
      const outcome = decideBounceOutcome({
        tags: { ...primaryTags, allow_fallback },
        hasOriginalMessage: true,
      });

      expect(outcome.action).toBe("alert-only");
    });
  });

  it("refuse aussi quand l'etiquette d'autorisation manque", () => {
    const outcome = decideBounceOutcome({
      tags: { recipient: "contact-tennis", delivery_type: "primary" },
      hasOriginalMessage: true,
    });

    expect(outcome.action).toBe("alert-only");
  });

  it("ne renvoie jamais le rebond d'un renvoi : c'est la boucle a couper", () => {
    const outcome = decideBounceOutcome({
      tags: { ...primaryTags, delivery_type: "fallback" },
      hasOriginalMessage: true,
    });

    expect(outcome.action).toBe("alert-only");
    expect(outcome).toHaveProperty("reason", expect.stringContaining("renvoi"));
  });

  it("coupe la boucle avant meme de regarder l'autorisation", () => {
    const outcome = decideBounceOutcome({
      tags: { allow_fallback: "true", delivery_type: "fallback" },
      hasOriginalMessage: true,
    });

    expect(outcome.action).toBe("alert-only");
  });

  it("ne renvoie pas un message qu'il ne sait pas identifier", () => {
    expect(
      decideBounceOutcome({ tags: undefined, hasOriginalMessage: true }).action,
    ).toBe("alert-only");
    expect(
      decideBounceOutcome({ tags: {}, hasOriginalMessage: true }).action,
    ).toBe("alert-only");
  });

  it("ne renvoie pas quand le message d'origine est introuvable", () => {
    const outcome = decideBounceOutcome({
      tags: primaryTags,
      hasOriginalMessage: false,
    });

    expect(outcome.action).toBe("alert-only");
    expect(outcome).toHaveProperty(
      "reason",
      expect.stringContaining("introuvable"),
    );
  });
});

describe("buildFallbackIdempotencyKey", () => {
  it("derive du message rebondi, donc deux livraisons du meme evenement donnent la meme clef", () => {
    const key = buildFallbackIdempotencyKey(
      "56761188-7520-42d8-8898-ff6fc54ce618",
    );

    expect(key).toBe("contact-fallback-56761188-7520-42d8-8898-ff6fc54ce618");
    expect(
      buildFallbackIdempotencyKey("56761188-7520-42d8-8898-ff6fc54ce618"),
    ).toBe(key);
  });

  it("distingue deux messages differents", () => {
    expect(buildFallbackIdempotencyKey("a")).not.toBe(
      buildFallbackIdempotencyKey("b"),
    );
  });
});

describe("composition du renvoi", () => {
  const notice = {
    originalRecipient: "tennis@esc15.fr",
    fallbackRecipient: "contact@esc15.fr",
    bounceMessage: "Recipient address rejected",
  };

  it("prefixe le sujet sans repeter la section, deja presente", () => {
    expect(
      buildFallbackSubject("[Tennis] Cours d'essai — Camille Durand"),
    ).toBe("[Renvoi] [Tennis] Cours d'essai — Camille Durand");
  });

  it("dit d'ou vient le message et pourquoi il a ete transmis", () => {
    const text = buildFallbackText({ originalText: "Bonjour…", ...notice });

    expect(text).toContain("initialement destiné à tennis@esc15.fr");
    expect(text).toContain("transmis à contact@esc15.fr");
    expect(text).toContain("Recipient address rejected");
    expect(text).toContain("Bonjour…");
  });

  it("se passe du motif quand l'emetteur n'en donne pas", () => {
    const text = buildFallbackText({
      originalText: "Bonjour…",
      ...notice,
      bounceMessage: null,
    });

    expect(text).not.toContain("Motif du refus");
  });

  it("echappe le bandeau, dont le contenu vient de l'emetteur", () => {
    const html = buildFallbackHtml({
      originalHtml: "<p>Bonjour</p>",
      ...notice,
      bounceMessage: '<script>alert("x")</script>',
    });

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("reprend le corps d'origine tel quel, deja echappe a l'envoi", () => {
    const html = buildFallbackHtml({
      originalHtml: "<p>Bonjour &amp; merci</p>",
      ...notice,
    });

    expect(html).toContain("<p>Bonjour &amp; merci</p>");
  });
});
