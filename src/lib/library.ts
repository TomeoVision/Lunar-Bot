import type { ContentLibraryData, LibraryBio, LibraryImageItem, LibrarySnippet } from "../types";

const KEY = "muraldeck:library";

function readLibrary(): ContentLibraryData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { bios: [], images: [], snippets: [] };
    const parsed = JSON.parse(raw) as Partial<ContentLibraryData>;
    return {
      bios: parsed.bios ?? [],
      images: parsed.images ?? [],
      snippets: parsed.snippets ?? [],
    };
  } catch {
    return { bios: [], images: [], snippets: [] };
  }
}

function writeLibrary(data: ContentLibraryData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getLibrary(): ContentLibraryData {
  return readLibrary();
}

export function saveBio(bio: LibraryBio): void {
  const lib = readLibrary();
  const idx = lib.bios.findIndex((b) => b.id === bio.id);
  if (idx >= 0) lib.bios[idx] = bio;
  else lib.bios.push(bio);
  writeLibrary(lib);
}

export function deleteBio(id: string): void {
  const lib = readLibrary();
  lib.bios = lib.bios.filter((b) => b.id !== id);
  writeLibrary(lib);
}

export function saveLibraryImage(image: LibraryImageItem): void {
  const lib = readLibrary();
  const idx = lib.images.findIndex((i) => i.id === image.id);
  if (idx >= 0) lib.images[idx] = image;
  else lib.images.push(image);
  writeLibrary(lib);
}

export function deleteLibraryImage(id: string): void {
  const lib = readLibrary();
  lib.images = lib.images.filter((i) => i.id !== id);
  writeLibrary(lib);
}

export function saveSnippet(snippet: LibrarySnippet): void {
  const lib = readLibrary();
  const idx = lib.snippets.findIndex((s) => s.id === snippet.id);
  if (idx >= 0) lib.snippets[idx] = snippet;
  else lib.snippets.push(snippet);
  writeLibrary(lib);
}

export function deleteSnippet(id: string): void {
  const lib = readLibrary();
  lib.snippets = lib.snippets.filter((s) => s.id !== id);
  writeLibrary(lib);
}
