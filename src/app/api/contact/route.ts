import { NextResponse } from "next/server";
import { buildContactMessage } from "@/features/contact/lib/buildContactMessage";
import {
  resolveContactSender,
  resolveTokenSecret,
} from "@/features/contact/lib/contactEnvironment";
import {
  createContactToken,
  verifyContactToken,
} from "@/features/contact/lib/contactToken";
import {
  parseContactRequest,
  readRecord,
  readString,
} from "@/features/contact/lib/parseContactRequest";
import { resolveContactRecipient } from "@/features/contact/lib/resolveContactRecipient";

/** `node:crypto` signe le jeton : la route a besoin du runtime Node. */
export const runtime = "nodejs";

/**
 * Plafond avant meme l'analyse JSON : inutile de deserialiser une charge
 * volumineuse pour decouvrir ensuite que le message depasse la limite.
 */
const MAX_BODY_LENGTH = 8_000;

const UNAVAILABLE_MESSAGE =
  "Le formulaire est momentanément indisponible. Écrivez directement à la section.";

const GENERIC_ERROR_MESSAGE =
  "L'envoi a échoué. Réessayez dans un instant ou écrivez directement à la section.";

const STALE_TOKEN_MESSAGE =
  "Votre message a été envoyé trop vite ou la page est restée ouverte trop longtemps. Rechargez la page et réessayez.";

const readBody = async (request: Request) => {
  const body = await request.text().catch(() => "");

  if (body.length === 0 || body.length > MAX_BODY_LENGTH) {
    return null;
  }

  return JSON.parse(body) as unknown;
};

/**
 * Le formulaire demande son jeton a l'ouverture. C'est ce qui date le debut
 * de la saisie sans rendre la page dynamique : les pages de section restent
 * pre-generees, seule cette route s'execute.
 */
export const GET = () => {
  const secret = resolveTokenSecret();

  return secret
    ? NextResponse.json({ token: createContactToken(Date.now(), secret) })
    : NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 503 });
};

export const POST = async (request: Request) => {
  const secret = resolveTokenSecret();
  const send = resolveContactSender();

  if (!secret || !send) {
    return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 503 });
  }

  const payload = await readBody(request).catch(() => null);

  if (!payload) {
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 400 });
  }

  const raw = readRecord(payload);

  // Champ leurre : invisible et jamais rempli par un humain. On repond un
  // succes pour ne rien apprendre au robot sur ce qui l'a fait echouer.
  if (readString(raw.website).length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!verifyContactToken(readString(raw.token), secret, Date.now())) {
    return NextResponse.json({ error: STALE_TOKEN_MESSAGE }, { status: 400 });
  }

  const parsed = parseContactRequest(payload);

  if (!parsed.ok) {
    return NextResponse.json(
      { error: parsed.violations[0], violations: parsed.violations },
      { status: 400 },
    );
  }

  const recipient = resolveContactRecipient(parsed.value.recipientSlug);

  if (!recipient) {
    return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 400 });
  }

  try {
    const delivery = await send(buildContactMessage(parsed.value, recipient));

    return NextResponse.json({ ok: true, deliveryMode: delivery.mode });
  } catch (error) {
    console.error("[contact] envoi impossible", error);

    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 502 });
  }
};
