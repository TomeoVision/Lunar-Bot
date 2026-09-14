import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProposalMeta } from "../types";
import { deleteProposal, listProposals, loadProposal, saveProposal } from "../lib/storage";
import { v4 as uuid } from "uuid";

export function Library() {
  const [proposals, setProposals] = useState<ProposalMeta[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProposals(listProposals());
  }, []);

  function refresh() {
    setProposals(listProposals());
  }

  function createNew() {
    navigate("/edit/new");
  }

  function duplicate(id: string) {
    const existing = loadProposal(id);
    if (!existing) return;
    const copy = {
      ...existing,
      id: uuid(),
      title: existing.title + " (copy)",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveProposal(copy);
    navigate(`/edit/${copy.id}`);
  }

  function remove(id: string) {
    if (!confirm("Delete this proposal? This can't be undone.")) return;
    deleteProposal(id);
    refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Proposal Decks</h1>
          <p className="mt-1 text-sm text-stone-500">
            Build a proposal deck for a mural or project, then share a link or export a PDF.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/content")}
            className="rounded border border-stone-300 px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
          >
            Content Library
          </button>
          <button
            onClick={createNew}
            className="rounded bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            + New proposal
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {proposals.length === 0 && (
          <div className="rounded border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">
            No proposals yet. Create your first one to get started.
          </div>
        )}
        {proposals.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded border border-stone-200 bg-white px-4 py-3"
          >
            <button onClick={() => navigate(`/edit/${p.id}`)} className="text-left">
              <div className="font-medium text-stone-800">{p.title || "Untitled Proposal"}</div>
              <div className="text-xs text-stone-400">
                Updated {new Date(p.updatedAt).toLocaleString()}
              </div>
            </button>
            <div className="flex items-center gap-3 text-sm">
              <button onClick={() => duplicate(p.id)} className="text-stone-500 hover:text-stone-800">
                Duplicate
              </button>
              <button onClick={() => remove(p.id)} className="text-stone-500 hover:text-red-500">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
