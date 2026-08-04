import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConditions(conditions: string[]) {
  if (conditions.length === 1) {
    return conditions[0];
  }

  if (conditions.length === 2) {
    return conditions.join(" or ");
  }

  return `${conditions.slice(0, -1).join(", ")}, or ${conditions.at(-1)}`;
}

export function openFullPage(path: string) {
  window.location.href = path;
}
