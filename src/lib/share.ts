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

/** Pulls the `d` share payload out of an arbitrary pasted share URL (hash-routed). */
export function extractShareData(url: string): string | null {
  try {
    const hashIndex = url.indexOf("#");
    if (hashIndex === -1) return null;
    const afterHash = url.slice(hashIndex + 1);
    const queryIndex = afterHash.indexOf("?");
    if (queryIndex === -1) return null;
    const params = new URLSearchParams(afterHash.slice(queryIndex + 1));
    return params.get("d");
  } catch {
    return null;
  }
}
