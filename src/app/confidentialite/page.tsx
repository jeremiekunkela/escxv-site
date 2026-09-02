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
      description="Ce site est volontairement sobre : il ne dépose aucun cookie, ne vous suit pas d'un site à l'autre et ne crée aucun compte."
    >
      <LegalSection title="Ce que ce site ne fait pas">
        <p>
          Il ne dépose aucun cookie, ne crée aucun profil de visiteur et ne
          vous suit pas d&apos;un site à l&apos;autre. Les pages sont générées
          à l&apos;avance et servies telles quelles : l&apos;association
          n&apos;enregistre aucune donnée de navigation et ne dispose
          d&apos;aucune base de données.
        </p>
      </LegalSection>

      <LegalSection title="Mesure d'audience">
        <p>
          Nous comptons les visites et les pages consultées, pour savoir ce qui
          est utile et ce qui ne l&apos;est pas, ainsi que les temps de
          chargement, pour repérer les pages trop lentes. Ces mesures sont
          assurées par <strong>Vercel</strong>, l&apos;hébergeur du site :
          elles fonctionnent <strong>sans cookie</strong> et sans identifiant
          persistant, ne conservent que des totaux agrégés, et ne permettent ni
          de vous reconnaître d&apos;une visite à l&apos;autre, ni de vous
          suivre ailleurs sur le web.
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
          Que vous passiez par le formulaire d&apos;une page de section ou par
          une adresse courriel, votre message arrive dans la boîte du
          responsable de la section concernée, et nulle part ailleurs. Il ne
          sert qu&apos;à vous répondre, n&apos;est transmis à personne
          d&apos;autre et ne donne lieu à aucun envoi promotionnel.
        </p>
        <p>
          Le formulaire recueille votre nom, votre adresse email, votre
          téléphone si vous le renseignez, le sujet choisi et votre message.{" "}
          <strong>Le site n&apos;en conserve aucune copie</strong> : il ne
          dispose d&apos;aucune base de données. Le message est acheminé par
          Scaleway, hébergeur français, puis conservé dans la boîte du
          responsable le temps de traiter votre demande.
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
