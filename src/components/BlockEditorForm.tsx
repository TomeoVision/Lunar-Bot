import { v4 as uuid } from "uuid";
import type {
  Block,
  GalleryImage,
  LineItem,
  MilestoneItem,
} from "../types";
import { Field, TextInput, TextArea, NumberInput } from "./Field";
import { ImageInput } from "./ImageInput";

function GalleryEditor({
  images,
  onChange,
}: {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}) {
  function update(id: string, patch: Partial<GalleryImage>) {
    onChange(images.map((img) => (img.id === id ? { ...img, ...patch } : img)));
  }
  function remove(id: string) {
    onChange(images.filter((img) => img.id !== id));
  }
  function add() {
    onChange([...images, { id: uuid(), src: "", caption: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {images.map((img) => (
        <div key={img.id} className="flex items-start gap-3 rounded border border-stone-200 p-2">
          <ImageInput value={img.src} onChange={(src) => update(img.id, { src })} />
          <div className="flex flex-1 flex-col gap-1">
            <TextInput
              placeholder="Caption"
              value={img.caption}
              onChange={(e) => update(img.id, { caption: e.target.value })}
            />
            <button
              type="button"
              onClick={() => remove(img.id)}
              className="self-start text-xs text-stone-400 hover:text-red-500"
            >
              Remove image
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start rounded border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50"
      >
        + Add image
      </button>
    </div>
  );
}

export function BlockEditorForm({
  block,
  onChange,
}: {
  block: Block;
  onChange: (updated: Block) => void;
}) {
  switch (block.type) {
    case "cover":
      return (
        <div className="flex flex-col gap-4">
          <Field label="Project title">
            <TextInput value={block.projectTitle} onChange={(e) => onChange({ ...block, projectTitle: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <TextInput value={block.tagline} onChange={(e) => onChange({ ...block, tagline: e.target.value })} />
          </Field>
          <ImageInput label="Hero image" value={block.heroImage} onChange={(heroImage) => onChange({ ...block, heroImage })} />
          <Field label="Prepared for (client)">
            <TextInput value={block.clientName} onChange={(e) => onChange({ ...block, clientName: e.target.value })} />
          </Field>
          <Field label="Location">
            <TextInput value={block.location} onChange={(e) => onChange({ ...block, location: e.target.value })} />
          </Field>
          <Field label="Prepared by">
            <TextInput value={block.preparedBy} onChange={(e) => onChange({ ...block, preparedBy: e.target.value })} />
          </Field>
          <Field label="Date">
            <TextInput value={block.date} onChange={(e) => onChange({ ...block, date: e.target.value })} />
          </Field>
        </div>
      );

    case "about":
      return (
        <div className="flex flex-col gap-4">
          <Field label="Section heading">
            <TextInput value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
          </Field>
          <Field label="Artist / studio name">
            <TextInput value={block.artistName} onChange={(e) => onChange({ ...block, artistName: e.target.value })} />
          </Field>
          <ImageInput label="Headshot" value={block.headshot} onChange={(headshot) => onChange({ ...block, headshot })} />
          <Field label="Bio">
            <TextArea rows={6} value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
          </Field>
        </div>
      );

    case "concept":
      return (
        <div className="flex flex-col gap-4">
          <Field label="Section heading">
            <TextInput value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
          </Field>
          <Field label="Concept narrative">
            <TextArea rows={6} value={block.narrative} onChange={(e) => onChange({ ...block, narrative: e.target.value })} />
          </Field>
          <Field label="Mockup / reference images">
            <GalleryEditor images={block.images} onChange={(images) => onChange({ ...block, images })} />
          </Field>
        </div>
      );

    case "scope": {
      const b = block;
      function updateMilestone(id: string, patch: Partial<MilestoneItem>) {
        onChange({
          ...b,
          milestones: b.milestones.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        });
      }
      function removeMilestone(id: string) {
        onChange({ ...b, milestones: b.milestones.filter((m) => m.id !== id) });
      }
      function addMilestone() {
        onChange({
          ...b,
          milestones: [...b.milestones, { id: uuid(), label: "New milestone", window: "", detail: "" }],
        });
      }
      return (
        <div className="flex flex-col gap-4">
          <Field label="Section heading">
            <TextInput value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
          </Field>
          <Field label="Intro">
            <TextArea rows={2} value={block.intro} onChange={(e) => onChange({ ...block, intro: e.target.value })} />
          </Field>
          <div className="flex flex-col gap-3">
            {block.milestones.map((m) => (
              <div key={m.id} className="rounded border border-stone-200 p-3">
                <div className="flex gap-2">
                  <TextInput
                    placeholder="Milestone"
                    value={m.label}
                    onChange={(e) => updateMilestone(m.id, { label: e.target.value })}
                  />
                  <TextInput
                    placeholder="Timeframe"
                    value={m.window}
                    onChange={(e) => updateMilestone(m.id, { window: e.target.value })}
                    className="max-w-[140px]"
                  />
                </div>
                <TextArea
                  className="mt-2"
                  rows={2}
                  placeholder="Detail"
                  value={m.detail}
                  onChange={(e) => updateMilestone(m.id, { detail: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeMilestone(m.id)}
                  className="mt-1 text-xs text-stone-400 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMilestone}
              className="self-start rounded border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50"
            >
              + Add milestone
            </button>
          </div>
        </div>
      );
    }

    case "budget": {
      const b = block;
      function updateItem(id: string, patch: Partial<LineItem>) {
        onChange({ ...b, items: b.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });
      }
      function removeItem(id: string) {
        onChange({ ...b, items: b.items.filter((it) => it.id !== id) });
      }
      function addItem() {
        onChange({
          ...b,
          items: [...b.items, { id: uuid(), label: "New line item", detail: "", amount: 0 }],
        });
      }
      const total = b.items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
      return (
        <div className="flex flex-col gap-4">
          <Field label="Section heading">
            <TextInput value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
          </Field>
          <Field label="Note">
            <TextArea rows={2} value={block.note} onChange={(e) => onChange({ ...block, note: e.target.value })} />
          </Field>
          <div className="flex flex-col gap-3">
            {block.items.map((it) => (
              <div key={it.id} className="rounded border border-stone-200 p-3">
                <div className="flex gap-2">
                  <TextInput
                    placeholder="Line item"
                    value={it.label}
                    onChange={(e) => updateItem(it.id, { label: e.target.value })}
                  />
                  <NumberInput
                    placeholder="Amount"
                    value={it.amount}
                    onChange={(e) => updateItem(it.id, { amount: Number(e.target.value) })}
                    className="max-w-[110px]"
                  />
                </div>
                <TextInput
                  className="mt-2"
                  placeholder="Detail"
                  value={it.detail}
                  onChange={(e) => updateItem(it.id, { detail: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="mt-1 text-xs text-stone-400 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="self-start rounded border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50"
            >
              + Add line item
            </button>
          </div>
          <div className="flex items-center justify-between rounded bg-stone-50 px-3 py-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.showTotal}
                onChange={(e) => onChange({ ...block, showTotal: e.target.checked })}
              />
              Show total
            </label>
            <span className="font-medium">
              {total.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      );
    }

    case "materials": {
      const b = block;
      function updateBullet(i: number, value: string) {
        const bullets = [...b.bullets];
        bullets[i] = value;
        onChange({ ...b, bullets });
      }
      function removeBullet(i: number) {
        onChange({ ...b, bullets: b.bullets.filter((_, idx) => idx !== i) });
      }
      function addBullet() {
        onChange({ ...b, bullets: [...b.bullets, ""] });
      }
      return (
        <div className="flex flex-col gap-4">
          <Field label="Section heading">
            <TextInput value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
          </Field>
          <Field label="Body">
            <TextArea rows={3} value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
          </Field>
          <div className="flex flex-col gap-2">
            {block.bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <TextInput value={b} onChange={(e) => updateBullet(i, e.target.value)} />
                <button type="button" onClick={() => removeBullet(i)} className="text-xs text-stone-400 hover:text-red-500">
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBullet}
              className="self-start rounded border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50"
            >
              + Add bullet
            </button>
          </div>
        </div>
      );
    }

    case "portfolio":
      return (
        <div className="flex flex-col gap-4">
          <Field label="Section heading">
            <TextInput value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
          </Field>
          <Field label="Intro">
            <TextArea rows={2} value={block.intro} onChange={(e) => onChange({ ...block, intro: e.target.value })} />
          </Field>
          <Field label="Images">
            <GalleryEditor images={block.images} onChange={(images) => onChange({ ...block, images })} />
          </Field>
        </div>
      );

    case "terms":
      return (
        <div className="flex flex-col gap-4">
          <Field label="Section heading">
            <TextInput value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
          </Field>
          <Field label="Terms">
            <TextArea rows={4} value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
          </Field>
          <Field label="Contact name">
            <TextInput value={block.contactName} onChange={(e) => onChange({ ...block, contactName: e.target.value })} />
          </Field>
          <Field label="Contact email">
            <TextInput value={block.contactEmail} onChange={(e) => onChange({ ...block, contactEmail: e.target.value })} />
          </Field>
          <Field label="Contact phone">
            <TextInput value={block.contactPhone} onChange={(e) => onChange({ ...block, contactPhone: e.target.value })} />
          </Field>
        </div>
      );

    case "custom":
      return (
        <div className="flex flex-col gap-4">
          <Field label="Section heading">
            <TextInput value={block.heading} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
          </Field>
          <Field label="Body">
            <TextArea rows={6} value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
          </Field>
        </div>
      );
  }
}
