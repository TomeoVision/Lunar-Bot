import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Block, Proposal } from "../types";
import { loadProposal, saveProposal } from "../lib/storage";
import { createStarterProposal } from "../data/blockDefaults";
import { buildShareUrl } from "../lib/share";
import { exportPagesToPdf } from "../lib/pdf";
import { Sidebar } from "../components/Sidebar";
import { BlockEditorForm } from "../components/BlockEditorForm";
import { ThemePicker } from "../components/ThemePicker";
import { DeckView } from "../components/DeckView";
import { Field, TextInput } from "../components/Field";

export function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const pageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!id) return;
    if (id === "new") {
      const fresh = createStarterProposal();
      setProposal(fresh);
      setActiveId(fresh.blocks[0]?.id ?? null);
      navigate(`/edit/${fresh.id}`, { replace: true });
      return;
    }
    const existing = loadProposal(id);
    if (existing) {
      setProposal(existing);
      setActiveId(existing.blocks[0]?.id ?? null);
    } else {
      navigate("/", { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (proposal) saveProposal(proposal);
  }, [proposal]);

  const activeBlock = useMemo(
    () => proposal?.blocks.find((b) => b.id === activeId) ?? null,
    [proposal, activeId],
  );

  if (!proposal) {
    return <div className="p-8 text-sm text-stone-500">Loading…</div>;
  }

  function updateBlock(updated: Block) {
    setProposal((p) => (p ? { ...p, blocks: p.blocks.map((b) => (b.id === updated.id ? updated : b)) } : p));
  }

  function reorderBlocks(blocks: Block[]) {
    setProposal((p) => (p ? { ...p, blocks } : p));
  }

  function addBlock(block: Block) {
    setProposal((p) => (p ? { ...p, blocks: [...p.blocks, block] } : p));
    setActiveId(block.id);
  }

  function toggleHidden(blockId: string) {
    setProposal((p) =>
      p
        ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, hidden: !b.hidden } : b)) }
        : p,
    );
  }

  function deleteBlock(blockId: string) {
    setProposal((p) => {
      if (!p) return p;
      const blocks = p.blocks.filter((b) => b.id !== blockId);
      if (activeId === blockId) setActiveId(blocks[0]?.id ?? null);
      return { ...p, blocks };
    });
  }

  async function handleShare() {
    if (!proposal) return;
    const url = buildShareUrl(proposal);
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Link copied to clipboard");
    } catch {
      setShareStatus(url);
    }
    setTimeout(() => setShareStatus(null), 4000);
  }

  async function handleExportPdf() {
    if (!proposal) return;
    setExporting(true);
    try {
      const order = proposal.blocks.filter((b) => !b.hidden);
      const els = order.map((b) => pageRefs.current.get(b.id)).filter((el): el is HTMLDivElement => !!el);
      await exportPagesToPdf(els, `${proposal.title || "proposal"}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-stone-50">
      <header className="flex flex-wrap items-center gap-3 border-b border-stone-200 bg-white px-4 py-2.5">
        <button onClick={() => navigate("/")} className="text-sm text-stone-500 hover:text-stone-800">
          ← Library
        </button>
        <Field label="">
          <TextInput
            value={proposal.title}
            onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
            className="w-56 font-medium"
          />
        </Field>
        <ThemePicker value={proposal.themeId} onChange={(themeId) => setProposal({ ...proposal, themeId })} />
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
            className="rounded border border-stone-300 px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
          >
            {mode === "edit" ? "Preview" : "Back to editing"}
          </button>
          <button
            onClick={handleShare}
            className="rounded border border-stone-300 px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
          >
            Copy share link
          </button>
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="rounded bg-stone-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
        </div>
      </header>

      {shareStatus && (
        <div className="break-all border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          {shareStatus}
        </div>
      )}

      {mode === "edit" ? (
        <div className="grid flex-1 grid-cols-[220px_360px_1fr] overflow-hidden">
          <div className="overflow-y-auto border-r border-stone-200 bg-white">
            <Sidebar
              blocks={proposal.blocks}
              activeId={activeId}
              onSelect={setActiveId}
              onReorder={reorderBlocks}
              onAdd={addBlock}
              onToggleHidden={toggleHidden}
              onDelete={deleteBlock}
            />
          </div>
          <div className="overflow-y-auto border-r border-stone-200 bg-white p-4">
            {activeBlock ? (
              <BlockEditorForm block={activeBlock} onChange={updateBlock} />
            ) : (
              <div className="text-sm text-stone-400">Select or add a section to edit it.</div>
            )}
          </div>
          <div className="overflow-y-auto">
            <DeckView
              proposal={proposal}
              registerPageRef={(blockId, el) => {
                if (el) pageRefs.current.set(blockId, el);
                else pageRefs.current.delete(blockId);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <DeckView
            proposal={proposal}
            registerPageRef={(blockId, el) => {
              if (el) pageRefs.current.set(blockId, el);
              else pageRefs.current.delete(blockId);
            }}
          />
        </div>
      )}
    </div>
  );
}
