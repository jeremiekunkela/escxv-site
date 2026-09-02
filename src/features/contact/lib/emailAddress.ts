/**
 * Forme d'une adresse. Volontairement permissive : le seul verdict fiable sur
 * une adresse est l'envoi reel, la regle ecarte les fautes de frappe, pas les
 * adresses mortes.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Limite du standard, et garde-fou contre un champ rempli au kilometre. */
const MAX_LENGTH = 254;

/**
 * Un retour a la ligne dans une adresse recopiee en en-tete permettrait d'en
 * injecter d'autres (Bcc, Reply-To).
 */
const hasHeaderBreak = (value: string) => /[\r\n]/.test(value);

/**
 * Resend refuse tout en-tete non ASCII, et le refus n'arrive qu'a l'envoi,
 * devant le visiteur. Une adresse accentuee dans les donnees d'une section a
 * ainsi casse le formulaire du volley sans que rien ne le signale avant.
 */
export const isAsciiEmail = (value: string) =>
  [...value].every((character) => (character.codePointAt(0) ?? 0) < 128);

/** Adresse qu'on peut confier a l'emetteur sans qu'il la refuse. */
export const isSendableEmail = (value: string) =>
  value.length > 0 &&
  value.length <= MAX_LENGTH &&
  !hasHeaderBreak(value) &&
  isAsciiEmail(value) &&
  EMAIL_PATTERN.test(value);
