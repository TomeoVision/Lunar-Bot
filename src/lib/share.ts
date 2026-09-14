import LZString from "lz-string";
import type { Proposal } from "../types";

export function encodeProposalForShare(proposal: Proposal): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(proposal));
}

export function decodeProposalFromShare(encoded: string): Proposal | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as Proposal;
  } catch {
    return null;
  }
}

export function buildShareUrl(proposal: Proposal): string {
  const encoded = encodeProposalForShare(proposal);
  const base = window.location.origin + window.location.pathname;
  return `${base}#/view?d=${encodeURIComponent(encoded)}`;
}
