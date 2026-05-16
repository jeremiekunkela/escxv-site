import type { ActivityPublic, ActivityStatus } from "@/features/activities/types/activity";

export function formatStatus(status: ActivityStatus) {
  return status === "open" ? "Ouverte" : "Bientot";
}

export function formatEuro(amount: number) {
  return `${amount} €`;
}

export function formatPublicLabel(value: ActivityPublic) {
  if (value === "enfants") return "Enfants";
  if (value === "adolescents") return "Adolescents";
  return "Adultes";
}

export function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
