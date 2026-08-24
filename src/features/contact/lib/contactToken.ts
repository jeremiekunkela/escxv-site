import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Un formulaire renvoye plus vite qu'un humain ne le remplit vient d'un
 * robot. Trois secondes ne genent personne : il faut au minimum saisir un
 * nom, une adresse et dix caracteres de message.
 */
const MIN_FILL_DURATION_MS = 3_000;

/** Au-dela, le jeton est rejoue : on redemande une page. */
const MAX_TOKEN_AGE_MS = 2 * 60 * 60 * 1_000;

const sign = (issuedAt: number, secret: string) =>
  createHmac("sha256", secret).update(String(issuedAt)).digest("hex");

/**
 * Jeton signe remis a l'ouverture du formulaire. Signe, donc infalsifiable
 * sans le secret : un robot qui poste directement sur la route n'a aucun
 * horodatage valable a presenter.
 */
export const createContactToken = (issuedAt: number, secret: string) =>
  `${issuedAt}.${sign(issuedAt, secret)}`;

const hasSameSignature = (left: string, right: string) => {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);

  return (
    leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes)
  );
};

export const verifyContactToken = (
  token: string,
  secret: string,
  now: number,
) => {
  const [issuedAtPart, signature = ""] = token.split(".");
  const issuedAt = Number(issuedAtPart);
  const age = now - issuedAt;

  return (
    Number.isFinite(issuedAt) &&
    age >= MIN_FILL_DURATION_MS &&
    age <= MAX_TOKEN_AGE_MS &&
    hasSameSignature(signature, sign(issuedAt, secret))
  );
};
