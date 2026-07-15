import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes condicionais (clsx) resolvendo conflitos do Tailwind (tailwind-merge).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Formata segundos totais em "HH:MM:SS".
 */
export function formatHMS(totalSegundos: number): string {
  const s = Math.max(0, Math.floor(totalSegundos));
  const horas = Math.floor(s / 3600);
  const minutos = Math.floor((s % 3600) / 60);
  const segundos = s % 60;
  return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
}

/**
 * Formata segundos totais em "HH:MM".
 */
export function formatHM(totalSegundos: number): string {
  const s = Math.max(0, Math.floor(totalSegundos));
  const horas = Math.floor(s / 3600);
  const minutos = Math.floor((s % 3600) / 60);
  return `${pad(horas)}:${pad(minutos)}`;
}

/**
 * Formata segundos (com sinal) em "+HH:MM" ou "-HH:MM".
 */
export function formatHMSigned(segundos: number): string {
  const sinal = segundos < 0 ? "-" : "+";
  const abs = Math.abs(Math.floor(segundos));
  const horas = Math.floor(abs / 3600);
  const minutos = Math.floor((abs % 3600) / 60);
  return `${sinal}${pad(horas)}:${pad(minutos)}`;
}
