/**
 * Un deploiement de preversion sert la meme page que la production, a une
 * autre adresse : indexe, il devient un doublon qui dilue le site officiel et
 * peut sortir dans Google a sa place. Seule la production s'ouvre aux robots.
 *
 * `VERCEL_ENV` vaut « production », « preview » ou « development ». Absent —
 * en local, ou si l'hebergeur change — on refuse l'indexation par defaut :
 * mieux vaut une page absente de Google qu'une preversion indexee.
 */
export const isIndexableEnvironment = () =>
  process.env.VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_SITE_ENV === "production";
