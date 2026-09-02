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

export function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
