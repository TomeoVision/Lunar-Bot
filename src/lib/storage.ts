import type { Proposal, ProposalMeta } from "../types";

const INDEX_KEY = "muraldeck:index";
const PROPOSAL_KEY = (id: string) => `muraldeck:proposal:${id}`;

function readIndex(): ProposalMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as ProposalMeta[]) : [];
  } catch {
    return [];
  }
}

function writeIndex(index: ProposalMeta[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function listProposals(): ProposalMeta[] {
  return readIndex().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function loadProposal(id: string): Proposal | null {
  try {
    const raw = localStorage.getItem(PROPOSAL_KEY(id));
    return raw ? (JSON.parse(raw) as Proposal) : null;
  } catch {
    return null;
  }
}

export function saveProposal(proposal: Proposal): void {
  const updated: Proposal = { ...proposal, updatedAt: Date.now() };
  localStorage.setItem(PROPOSAL_KEY(updated.id), JSON.stringify(updated));

  const index = readIndex();
  const existing = index.findIndex((p) => p.id === updated.id);
  const meta: ProposalMeta = {
    id: updated.id,
    title: updated.title,
    updatedAt: updated.updatedAt,
  };
  if (existing >= 0) {
    index[existing] = meta;
  } else {
    index.push(meta);
  }
  writeIndex(index);
}

export function deleteProposal(id: string): void {
  localStorage.removeItem(PROPOSAL_KEY(id));
  writeIndex(readIndex().filter((p) => p.id !== id));
}
