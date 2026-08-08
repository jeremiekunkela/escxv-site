import type { Metadata } from "next";
import {
  LegalPage,
  LegalSection,
} from "@/components/shared/LegalPage/LegalPage";
import { getClubInfo } from "@/features/club/data-access/club";

const club = getClubInfo();

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Ce que le site de ${club.shortName} collecte, ce qu'il ne collecte pas, et comment exercer vos droits.`,
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Politique de confidentialité"
      description="Ce site est volontairement sobre : il ne vous suit pas et ne crée aucun compte."
    >
      <LegalSection title="Ce que ce site ne fait pas">
        <p>
          Il ne dépose aucun cookie, n&apos;utilise aucun outil de mesure
          d&apos;audience et ne crée aucun profil de visiteur. Les pages sont
          générées à l&apos;avance et servies telles quelles : aucune donnée de
          navigation n&apos;est enregistrée par l&apos;association.
        </p>
      </LegalSection>

      <LegalSection title="Services extérieurs">
        <p>
          Deux services tiers interviennent, chacun avec ses propres règles :
        </p>
        <ul>
          <li>
            <strong>Cartes Google Maps</strong> : les plans affichés sur les
            pages de section sont chargés depuis Google, qui peut déposer ses
            propres cookies au moment de l&apos;affichage de la carte.
          </li>
          <li>
            <strong>Inscriptions en ligne</strong> : les boutons
            d&apos;inscription mènent à la plateforme monclub, extérieure à ce
            site. Les informations saisies y sont traitées selon les conditions
            de cette plateforme.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Si vous nous écrivez">
        <p>
          Les messages adressés aux responsables de section arrivent dans une
          boîte courriel ordinaire. Ils ne sont utilisés que pour répondre à
          votre demande, ne sont transmis à personne d&apos;autre et ne servent
          à aucun envoi promotionnel.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Vous pouvez demander à consulter, corriger ou supprimer les
          informations vous concernant détenues par l&apos;association, en
          écrivant à{" "}
          {club.email ? (
            <a href={`mailto:${club.email}`}>{club.email}</a>
          ) : (
            "l'association"
          )}{" "}
          ou à {club.address}, {club.postalCode} {club.city}. En cas de
          désaccord, vous pouvez saisir la{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
            CNIL
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
