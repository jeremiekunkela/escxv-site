type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * Donnees structurees Schema.org. Elles ne changent rien a la page pour qui la
 * lit : elles disent a Google ce qu'il regarde — une association sportive, un
 * fil d'ariane, un article — pour qu'il l'affiche autrement qu'en lien nu.
 *
 * `dangerouslySetInnerHTML` est la voie recommandee par Next pour ce script :
 * le contenu vient de nos donnees, jamais d'une saisie de visiteur.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
