import { useState } from "react";
import { v4 as uuid } from "uuid";
import type { LibraryBio, LibraryImageItem, LibrarySnippet } from "../types";
import { getLibrary, saveBio, saveLibraryImage, saveSnippet } from "../lib/library";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2 text-xs">{children}</div>;
}

const selectClass = "rounded border border-stone-300 px-2 py-1 text-xs";
const btnClass = "rounded border border-stone-300 px-2 py-1 font-medium text-stone-600 hover:bg-stone-50";

export function BioLibraryControl({
  onInsert,
  onSaveRequest,
}: {
  onInsert: (bio: LibraryBio) => void;
  onSaveRequest: () => Omit<LibraryBio, "id" | "label">;
}) {
  const [bios, setBios] = useState(() => getLibrary().bios);

  function handleSave() {
    const label = window.prompt("Save this bio to your library as:");
    if (!label) return;
    const data = onSaveRequest();
    const bio: LibraryBio = { id: uuid(), label, ...data };
    saveBio(bio);
    setBios(getLibrary().bios);
  }

  return (
    <Row>
      <select
        className={selectClass}
        defaultValue=""
        onChange={(e) => {
          const bio = bios.find((b) => b.id === e.target.value);
          if (bio) onInsert(bio);
          e.target.value = "";
        }}
      >
        <option value="" disabled>
          Insert from library…
        </option>
        {bios.map((b) => (
          <option key={b.id} value={b.id}>
            {b.label}
          </option>
        ))}
      </select>
      <button type="button" onClick={handleSave} className={btnClass}>
        Save this bio to library
      </button>
    </Row>
  );
}

export function SnippetLibraryControl({
  onInsert,
  onSaveRequest,
}: {
  onInsert: (snippet: LibrarySnippet) => void;
  onSaveRequest: () => string;
}) {
  const [snippets, setSnippets] = useState(() => getLibrary().snippets);

  function handleSave() {
    const label = window.prompt("Save this text to your library as:");
    if (!label) return;
    const body = onSaveRequest();
    const snippet: LibrarySnippet = { id: uuid(), label, body };
    saveSnippet(snippet);
    setSnippets(getLibrary().snippets);
  }

  return (
    <Row>
      <select
        className={selectClass}
        defaultValue=""
        onChange={(e) => {
          const s = snippets.find((x) => x.id === e.target.value);
          if (s) onInsert(s);
          e.target.value = "";
        }}
      >
        <option value="" disabled>
          Insert from library…
        </option>
        {snippets.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <button type="button" onClick={handleSave} className={btnClass}>
        Save this text to library
      </button>
    </Row>
  );
}

export function ImageLibraryControl({
  onInsert,
}: {
  onInsert: (image: LibraryImageItem) => void;
}) {
  const [images, setImages] = useState(() => getLibrary().images);

  return (
    <Row>
      <select
        className={selectClass}
        defaultValue=""
        onChange={(e) => {
          const img = images.find((x) => x.id === e.target.value);
          if (img) onInsert(img);
          e.target.value = "";
        }}
        onFocus={() => setImages(getLibrary().images)}
      >
        <option value="" disabled>
          Insert image from library…
        </option>
        {images.map((img) => (
          <option key={img.id} value={img.id}>
            {img.label}
          </option>
        ))}
      </select>
    </Row>
  );
}

export function saveImageToLibraryPrompt(src: string, caption: string) {
  const label = window.prompt("Save this image to your library as:", caption || "Untitled image");
  if (!label) return;
  saveLibraryImage({ id: uuid(), label, src, caption });
}
