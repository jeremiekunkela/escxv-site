import type { ActivityPublic } from "@/features/activities/types/activity";

const publicLabels: Record<ActivityPublic, string> = {
  enfants: "Enfants",
  adolescents: "Adolescents",
  adultes: "Adultes",
};

export function formatEuro(amount: number) {
  return `${amount} €`;
}

export function formatPublicLabel(value: ActivityPublic) {
  return publicLabels[value];
}

/** Transforme un numero francais affiche ("01 45 75 23 36") en lien tel:. */
export function formatPhoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");

  return digits.startsWith("0") ? `tel:+33${digits.slice(1)}` : `tel:+${digits}`;
}

export function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
