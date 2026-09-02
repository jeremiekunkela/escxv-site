/**
 * Corps HTML du message de contact.
 *
 * Ecrit en tables et en styles en ligne : les clients de messagerie ignorent
 * les feuilles de style externes, et Outlook ne connait ni flex ni grid. Les
 * couleurs sont celles du site, en hexadecimal — `var()` et `rgba()` ne
 * passent pas non plus.
 *
 * Lu du cote du destinataire : une responsable de section ouvre sa boite et
 * doit reconnaitre d'ou vient le message, puis trouver qui ecrit et quoi. Le
 * bandeau porte donc le logo du club et rien d'autre — le nom de la section
 * est deja dans l'objet, et elle sait qui elle est. Le vert reste un accent,
 * jamais un aplat : un aplat de couleur derange la lecture d'une boite de
 * reception, ou tous les messages se suivent.
 */

/** Palette du site, aplatie sur fond blanc pour les clients sans alpha. */
const COLORS = {
  brand: "#1c392e",
  brandBright: "#2f6350",
  page: "#f4f6f7",
  surface: "#ffffff",
  border: "#e6ebe9",
  textPrimary: "#1a202c",
  textSecondary: "#64748b",
} as const;

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Tout ce qui vient du visiteur passe par la : un nom contenant `<` casserait
 * la mise en page, et un message pourrait glisser du balisage dans la boite
 * du responsable.
 */
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character] ?? character);

const toHtmlLines = (message: string) =>
  escapeHtml(message).split("\n").join("<br />");

export type ContactEmailContent = {
  recipientLabel: string;
  name: string;
  email: string;
  phone: string | null;
  subjectLabel: string;
  message: string;
  siteUrl: string;
  siteName: string;
  logoUrl: string;
  clubName: string;
};

/**
 * Libelle a gauche, valeur a droite : l'oeil descend une seule colonne de
 * valeurs au lieu d'alterner. La largeur fixe garde l'alignement dans les
 * clients qui recalculent les tables.
 */
const renderField = (label: string, value: string) => `
                  <tr>
                    <td width="96" valign="top" style="width: 96px; padding: 0 16px 12px 0; color: ${COLORS.textSecondary}; font-size: 12px; line-height: 1.5;">${escapeHtml(label)}</td>
                    <td valign="top" style="padding: 0 0 12px; color: ${COLORS.textPrimary}; font-size: 15px; line-height: 1.5;">${value}</td>
                  </tr>`;

export const renderContactEmailHtml = (content: ContactEmailContent) => {
  const fields = [
    renderField("Nom complet", escapeHtml(content.name)),
    renderField(
      "Email",
      `<a href="mailto:${escapeHtml(content.email)}" style="color: ${COLORS.brandBright}; text-decoration: none;">${escapeHtml(content.email)}</a>`,
    ),
    renderField("Téléphone", escapeHtml(content.phone ?? "non communiqué")),
    renderField("Sujet", escapeHtml(content.subjectLabel)),
    renderField("Pour", escapeHtml(content.recipientLabel)),
  ].join("");

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(content.subjectLabel)} — ${escapeHtml(content.name)}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: ${COLORS.page};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.page};">
      <tr>
        <td align="center" style="padding: 32px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width: 100%; max-width: 600px; background-color: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <tr>
              <td style="padding: 24px 32px 20px; border-bottom: 1px solid ${COLORS.border};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" width="52" style="width: 52px;">
                      <img src="${escapeHtml(content.logoUrl)}" width="52" height="41" alt="${escapeHtml(content.clubName)}" style="display: block; width: 52px; height: 41px; border: 0;" />
                    </td>
                    <td valign="middle" align="right" style="color: ${COLORS.textSecondary}; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;">Formulaire du site</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${fields}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 32px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="2" style="width: 2px; background-color: ${COLORS.brand};"></td>
                    <td style="padding: 2px 0 2px 18px; color: ${COLORS.textPrimary}; font-size: 15px; line-height: 1.75;">${toHtmlLines(content.message)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 32px 22px; border-top: 1px solid ${COLORS.border}; color: ${COLORS.textSecondary}; font-size: 12px; line-height: 1.7;">
                Répondez à ce message pour écrire à ${escapeHtml(content.name)}.<br />
                Envoyé depuis le formulaire de <a href="${escapeHtml(content.siteUrl)}" style="color: ${COLORS.brandBright}; text-decoration: none;">${escapeHtml(content.siteName)}</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
