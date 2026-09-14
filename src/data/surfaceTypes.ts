import type { SurfaceType } from "../types";

export const SURFACE_TYPES: { id: SurfaceType; label: string; multiplier: number }[] = [
  { id: "smooth", label: "Smooth stucco / drywall / metal", multiplier: 1 },
  { id: "textured", label: "Textured or rough stucco", multiplier: 1.15 },
  { id: "wood", label: "Wood siding / paneling", multiplier: 1.1 },
  { id: "brick", label: "Exposed brick", multiplier: 1.3 },
  { id: "concrete_block", label: "Raw concrete block", multiplier: 1.25 },
];

export function surfaceMultiplier(id: SurfaceType): number {
  return SURFACE_TYPES.find((s) => s.id === id)?.multiplier ?? 1;
}

export function surfaceLabel(id: SurfaceType): string {
  return SURFACE_TYPES.find((s) => s.id === id)?.label ?? id;
}
