import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { buildShareUrl, decodeProposalFromShare } from "../lib/share";
import { recordView, type ViewLog } from "../lib/viewLog";
import type { Approval, Proposal } from "../types";
import { DeckView } from "../components/DeckView";

export function ViewPage() {
  const [searchParams] = useSearchParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [error, setError] = useState(false);
  const [confirmationLink, setConfirmationLink] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [viewLog, setViewLog] = useState<ViewLog | null>(null);

  useEffect(() => {
    const data = searchParams.get("d");
    if (!data) {
      setError(true);
      return;
    }
    const decoded = decodeProposalFromShare(data);
    if (decoded) {
      setProposal(decoded);
      setViewLog(recordView(decoded.id));
    } else {
      setError(true);
    }
  }, [searchParams]);

  const contactEmail = useMemo(() => {
    if (!proposal) return "";
    const terms = proposal.blocks.find((b) => b.type === "terms");
    return terms && terms.type === "terms" ? terms.contactEmail : "";
  }, [proposal]);

  function handleApprove(name: string) {
    if (!proposal) return;
    const newApproval: Approval = { name, approvedAt: Date.now() };
    const updated = { ...proposal, approval: newApproval };
    setProposal(updated);
    setConfirmationLink(buildShareUrl(updated));
  }

  async function copyConfirmationLink() {
    if (!confirmationLink) return;
    try {
      await navigator.clipboard.writeText(confirmationLink);
      setCopyStatus("Copied!");
    } catch {
      setCopyStatus(confirmationLink);
    }
    setTimeout(() => setCopyStatus(null), 4000);
  }

  function emailConfirmation() {
    if (!confirmationLink || !proposal) return;
    const subject = encodeURIComponent(`Approved: ${proposal.title || "Proposal"}`);
    const body = encodeURIComponent(
      `I've approved this proposal. Here's the confirmation link:\n\n${confirmationLink}`,
    );
    const mailto = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-stone-500">
        This link doesn't contain a valid proposal.
      </div>
    );
  }

  if (!proposal) {
    return <div className="flex h-screen items-center justify-center text-sm text-stone-500">Loading…</div>;
  }

  return (
    <div>
      <DeckView proposal={proposal} interactive onApprove={handleApprove} />

      {confirmationLink && (
        <div className="mx-auto max-w-[850px] px-4 pb-8">
          <div className="rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <div className="font-medium">Thanks — you're approved!</div>
            <p className="mt-1">
              This app has no server, so nothing was sent automatically. Send the confirmation
              link below back to the proposal's owner so they know you approved it.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {contactEmail && (
                <button
                  onClick={emailConfirmation}
                  className="rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800"
                >
                  Email confirmation to {contactEmail}
                </button>
              )}
              <button
                onClick={copyConfirmationLink}
                className="rounded border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
              >
                Copy confirmation link
              </button>
            </div>
            {copyStatus && <div className="mt-2 break-all text-xs">{copyStatus}</div>}
          </div>
        </div>
      )}

      {viewLog && (
        <div className="pb-8 text-center text-xs text-stone-400">
          First viewed on this device {new Date(viewLog.firstViewedAt).toLocaleDateString()}
          {viewLog.count > 1 ? ` · viewed ${viewLog.count} times` : ""}
        </div>
      )}
    </div>
  );
}
