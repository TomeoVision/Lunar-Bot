import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { decodeProposalFromShare } from "../lib/share";
import type { Proposal } from "../types";
import { DeckView } from "../components/DeckView";

export function ViewPage() {
  const [searchParams] = useSearchParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const data = searchParams.get("d");
    if (!data) {
      setError(true);
      return;
    }
    const decoded = decodeProposalFromShare(data);
    if (decoded) setProposal(decoded);
    else setError(true);
  }, [searchParams]);

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

  return <DeckView proposal={proposal} />;
}
