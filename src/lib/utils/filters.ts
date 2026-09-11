/**
 * Manipulation d'un critere de filtre multi-valeur, partout la meme : une
 * liste de valeurs cochees, jamais mutee. Les pages activites et lieux
 * cochent des choses differentes, mais de la meme facon.
 */

export const toggleFilterValue = <Value extends string>(
  values: Value[],
  value: Value,
): Value[] =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];

/**
 * Retire une valeur du critere vise. Generique sur la clef : une etiquette
 * n'a pas a savoir de quel panneau elle vient, elle porte son critere.
 */
export const removeFilterValue = <
  Key extends string,
  Filters extends Record<Key, string[]>,
>(
  filters: Filters,
  key: Key,
  value: string,
): Filters => ({
  ...filters,
  [key]: filters[key].filter((current) => current !== value),
});
