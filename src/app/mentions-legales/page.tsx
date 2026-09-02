import type { Metadata } from "next";
import {
  LegalPage,
  LegalSection,
} from "@/components/shared/LegalPage/LegalPage";
import { getClubInfo } from "@/features/club/data-access/club";
import { getPublicationDirector } from "@/features/club/data-access/governance";

const club = getClubInfo();
const publicationDirector = getPublicationDirector();

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Éditeur, directeur de la publication et hébergeur du site de ${club.shortName}.`,
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Mentions légales"
      description="Qui édite ce site, qui en est responsable et qui l'héberge."
    >
      <LegalSection title="Éditeur du site">
        <p>
          {club.name} ({club.shortName}), association sportive.
          <br />
          {club.address}, {club.postalCode} {club.city}
          {club.email ? (
            <>
              <br />
              Courriel : <a href={`mailto:${club.email}`}>{club.email}</a>
            </>
          ) : null}
        </p>
      </LegalSection>

      <LegalSection title="Directeur de la publication">
        <p>
          {publicationDirector
            ? `${publicationDirector.firstName} ${publicationDirector.lastName}, ${publicationDirector.role.toLowerCase()} de l'association.`
            : "Le représentant légal de l'association."}
        </p>
      </LegalSection>

      <LegalSection title="Hébergeur">
        <p>
          Vercel Inc.
          <br />
          440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
          <br />
          <a href="https://vercel.com" target="_blank" rel="noreferrer">
            vercel.com
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          Les textes, les données sportives et le logo présentés sur ce site
          appartiennent à l&apos;association. Les photographies
          d&apos;illustration proviennent de la banque d&apos;images Unsplash et
          restent soumises à sa licence.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Ce site ne collecte aucune donnée de navigation. Le détail figure dans
          la <a href="/confidentialite">politique de confidentialité</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
