import { useState } from "react";
import type { Approval, Block, Theme } from "../../types";

function Page({
  theme,
  children,
  pageRef,
}: {
  theme: Theme;
  children: React.ReactNode;
  pageRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={pageRef}
      className="deck-page mx-auto w-full max-w-[850px] aspect-[210/297] overflow-y-auto shadow-lg"
      style={{
        background: theme.surface,
        color: theme.text,
        fontFamily: theme.body,
      }}
    >
      <div className="flex h-full flex-col p-10 sm:p-14">{children}</div>
    </div>
  );
}

function money(n: number): string {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function SignatureForm({ onApprove }: { onApprove: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your full name"
        className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
      />
      <button
        type="button"
        disabled={!name.trim()}
        onClick={() => onApprove(name.trim())}
        className="rounded bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-40"
      >
        Approve Proposal
      </button>
    </div>
  );
}

export function BlockDisplay({
  block,
  theme,
  pageRef,
  approval,
  interactive,
  onApprove,
}: {
  block: Block;
  theme: Theme;
  pageRef?: (el: HTMLDivElement | null) => void;
  approval?: Approval;
  interactive?: boolean;
  onApprove?: (name: string) => void;
}) {
  switch (block.type) {
    case "cover":
      return (
        <Page theme={theme} pageRef={pageRef}>
          <div className="flex h-full flex-col">
            <div className="text-sm tracking-widest uppercase" style={{ color: theme.subtext }}>
              Proposal
            </div>
            <div className="mt-6">
              <h1
                className="text-4xl leading-tight font-semibold sm:text-5xl"
                style={{ fontFamily: theme.heading, color: theme.text }}
              >
                {block.projectTitle}
              </h1>
              <p className="mt-3 text-lg" style={{ color: theme.subtext }}>
                {block.tagline}
              </p>
            </div>
            {block.heroImage && (
              <img
                src={block.heroImage}
                alt=""
                className="mt-8 max-h-[40%] w-full rounded object-cover"
              />
            )}
            <div className="mt-auto pt-8">
              <div className="grid grid-cols-2 gap-y-1 text-sm" style={{ color: theme.subtext }}>
                <div>Prepared for</div>
                <div style={{ color: theme.text }}>{block.clientName}</div>
                <div>Location</div>
                <div style={{ color: theme.text }}>{block.location}</div>
                <div>Prepared by</div>
                <div style={{ color: theme.text }}>{block.preparedBy}</div>
                <div>Date</div>
                <div style={{ color: theme.text }}>{block.date}</div>
              </div>
            </div>
          </div>
        </Page>
      );

    case "about":
      return (
        <Page theme={theme} pageRef={pageRef}>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.heading }}>
            {block.heading}
          </h2>
          <div className="mt-8 flex flex-1 flex-col gap-6 sm:flex-row">
            {block.headshot && (
              <img
                src={block.headshot}
                alt={block.artistName}
                className="h-32 w-32 shrink-0 rounded-full object-cover"
              />
            )}
            <div>
              <div className="font-medium" style={{ color: theme.accent }}>
                {block.artistName}
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed">{block.body}</p>
            </div>
          </div>
        </Page>
      );

    case "concept":
      return (
        <Page theme={theme} pageRef={pageRef}>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.heading }}>
            {block.heading}
          </h2>
          <p className="mt-6 whitespace-pre-wrap leading-relaxed">{block.narrative}</p>
          {block.images.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {block.images.map((img) => (
                <figure key={img.id}>
                  <img src={img.src} alt={img.caption} className="aspect-video w-full rounded object-cover" />
                  {img.caption && (
                    <figcaption className="mt-1 text-xs" style={{ color: theme.subtext }}>
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </Page>
      );

    case "scope":
      return (
        <Page theme={theme} pageRef={pageRef}>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.heading }}>
            {block.heading}
          </h2>
          <p className="mt-3" style={{ color: theme.subtext }}>
            {block.intro}
          </p>
          <div className="mt-6 flex flex-col gap-4">
            {block.milestones.map((m, i) => (
              <div key={m.id} className="flex gap-4">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                  style={{ background: theme.accent, color: theme.accentText }}
                >
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium">
                    {m.label}{" "}
                    <span className="font-normal" style={{ color: theme.subtext }}>
                      — {m.window}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: theme.subtext }}>
                    {m.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Page>
      );

    case "budget": {
      const total = block.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      return (
        <Page theme={theme} pageRef={pageRef}>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.heading }}>
            {block.heading}
          </h2>
          <p className="mt-3" style={{ color: theme.subtext }}>
            {block.note}
          </p>
          <div className="mt-6 flex flex-col">
            {block.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 border-b py-3"
                style={{ borderColor: theme.subtext + "33" }}
              >
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm" style={{ color: theme.subtext }}>
                    {item.detail}
                  </div>
                </div>
                <div className="shrink-0 font-medium">{money(Number(item.amount) || 0)}</div>
              </div>
            ))}
            {block.showTotal && (
              <div className="flex items-center justify-between pt-4 text-lg font-semibold">
                <div>Total</div>
                <div style={{ color: theme.accent }}>{money(total)}</div>
              </div>
            )}
          </div>
        </Page>
      );
    }

    case "materials":
      return (
        <Page theme={theme} pageRef={pageRef}>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.heading }}>
            {block.heading}
          </h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed">{block.body}</p>
          <ul className="mt-6 flex flex-col gap-2">
            {block.bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: theme.accent }}>•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Page>
      );

    case "portfolio":
      return (
        <Page theme={theme} pageRef={pageRef}>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.heading }}>
            {block.heading}
          </h2>
          <p className="mt-3" style={{ color: theme.subtext }}>
            {block.intro}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {block.images.map((img) => (
              <figure key={img.id}>
                <img src={img.src} alt={img.caption} className="aspect-square w-full rounded object-cover" />
                {img.caption && (
                  <figcaption className="mt-1 text-xs" style={{ color: theme.subtext }}>
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Page>
      );

    case "terms":
      return (
        <Page theme={theme} pageRef={pageRef}>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.heading }}>
            {block.heading}
          </h2>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed">{block.body}</p>
          <div className="mt-auto border-t pt-4 text-sm" style={{ borderColor: theme.subtext + "33", color: theme.subtext }}>
            <div className="font-medium" style={{ color: theme.text }}>
              {block.contactName}
            </div>
            <div>{block.contactEmail}</div>
            <div>{block.contactPhone}</div>
          </div>
        </Page>
      );

    case "signature":
      return (
        <Page theme={theme} pageRef={pageRef}>
          <div className="flex h-full flex-col">
            <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.heading }}>
              {block.heading}
            </h2>
            <p className="mt-4 whitespace-pre-wrap leading-relaxed">{block.agreementText}</p>
            <div className="mt-auto border-t pt-6" style={{ borderColor: theme.subtext + "33" }}>
              {approval ? (
                <div
                  className="rounded p-4 text-sm"
                  style={{ background: theme.accent + "1a", color: theme.text }}
                >
                  ✓ Approved by <strong>{approval.name}</strong> on{" "}
                  {new Date(approval.approvedAt).toLocaleDateString()}
                </div>
              ) : interactive && onApprove ? (
                <SignatureForm onApprove={onApprove} />
              ) : (
                <p className="text-sm italic" style={{ color: theme.subtext }}>
                  Recipients will see a name field and an "Approve Proposal" button here.
                </p>
              )}
            </div>
          </div>
        </Page>
      );

    case "custom":
      return (
        <Page theme={theme} pageRef={pageRef}>
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme.heading }}>
            {block.heading}
          </h2>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed">{block.body}</p>
        </Page>
      );
  }
}
