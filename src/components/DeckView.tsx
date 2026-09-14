import { THEMES } from "../data/themes";
import type { Proposal } from "../types";
import { BlockDisplay } from "./blocks/BlockDisplay";

export function DeckView({
  proposal,
  registerPageRef,
  interactive,
  onApprove,
}: {
  proposal: Proposal;
  registerPageRef?: (blockId: string, el: HTMLDivElement | null) => void;
  interactive?: boolean;
  onApprove?: (name: string) => void;
}) {
  const theme = THEMES[proposal.themeId];
  const visibleBlocks = proposal.blocks.filter((b) => !b.hidden);

  return (
    <div className="flex flex-col items-center gap-8 py-8" style={{ background: theme.bg }}>
      {visibleBlocks.map((block) => (
        <BlockDisplay
          key={block.id}
          block={block}
          theme={theme}
          pageRef={registerPageRef ? (el) => registerPageRef(block.id, el) : undefined}
          approval={proposal.approval}
          interactive={interactive}
          onApprove={onApprove}
        />
      ))}
    </div>
  );
}
