import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import type { LibraryBio, LibraryImageItem, LibrarySnippet } from "../types";
import { deleteBio, deleteLibraryImage, deleteSnippet, getLibrary, saveBio, saveLibraryImage, saveSnippet } from "../lib/library";
import { Field, TextInput, TextArea } from "../components/Field";
import { ImageInput } from "../components/ImageInput";

function emptyBio(): LibraryBio {
  return { id: uuid(), label: "", artistName: "", headshot: "", body: "" };
}
function emptyImage(): LibraryImageItem {
  return { id: uuid(), label: "", src: "", caption: "" };
}
function emptySnippet(): LibrarySnippet {
  return { id: uuid(), label: "", body: "" };
}

export function ContentLibrary() {
  const navigate = useNavigate();
  const [library, setLibrary] = useState(() => getLibrary());
  const [newBio, setNewBio] = useState<LibraryBio | null>(null);
  const [newImage, setNewImage] = useState<LibraryImageItem | null>(null);
  const [newSnippet, setNewSnippet] = useState<LibrarySnippet | null>(null);

  function refresh() {
    setLibrary(getLibrary());
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <button onClick={() => navigate("/")} className="text-sm text-stone-500 hover:text-stone-800">
        ← Proposals
      </button>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">Content Library</h1>
      <p className="mt-1 text-sm text-stone-500">
        Save reusable bios, photos, and boilerplate text so you can drop them into any proposal
        instead of retyping them.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-stone-800">Bios</h2>
        <div className="mt-3 flex flex-col gap-2">
          {library.bios.map((bio) => (
            <div key={bio.id} className="flex items-center gap-3 rounded border border-stone-200 bg-white p-3">
              {bio.headshot && <img src={bio.headshot} alt="" className="h-10 w-10 rounded-full object-cover" />}
              <div className="flex-1">
                <div className="font-medium text-stone-800">{bio.label}</div>
                <div className="text-xs text-stone-400">{bio.artistName}</div>
              </div>
              <button
                onClick={() => {
                  deleteBio(bio.id);
                  refresh();
                }}
                className="text-xs text-stone-400 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {newBio ? (
          <div className="mt-3 flex flex-col gap-3 rounded border border-stone-200 bg-white p-3">
            <Field label="Label">
              <TextInput value={newBio.label} onChange={(e) => setNewBio({ ...newBio, label: e.target.value })} />
            </Field>
            <Field label="Artist / studio name">
              <TextInput
                value={newBio.artistName}
                onChange={(e) => setNewBio({ ...newBio, artistName: e.target.value })}
              />
            </Field>
            <ImageInput label="Headshot" value={newBio.headshot} onChange={(headshot) => setNewBio({ ...newBio, headshot })} />
            <Field label="Bio">
              <TextArea rows={4} value={newBio.body} onChange={(e) => setNewBio({ ...newBio, body: e.target.value })} />
            </Field>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!newBio.label) return;
                  saveBio(newBio);
                  setNewBio(null);
                  refresh();
                }}
                className="rounded bg-stone-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700"
              >
                Save
              </button>
              <button onClick={() => setNewBio(null)} className="text-xs text-stone-500 hover:text-stone-800">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setNewBio(emptyBio())}
            className="mt-3 rounded border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50"
          >
            + Add bio
          </button>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-stone-800">Images</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {library.images.map((img) => (
            <div key={img.id} className="rounded border border-stone-200 bg-white p-2">
              <img src={img.src} alt={img.caption} className="aspect-square w-full rounded object-cover" />
              <div className="mt-1 truncate text-xs font-medium">{img.label}</div>
              <button
                onClick={() => {
                  deleteLibraryImage(img.id);
                  refresh();
                }}
                className="text-xs text-stone-400 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {newImage ? (
          <div className="mt-3 flex flex-col gap-3 rounded border border-stone-200 bg-white p-3">
            <Field label="Label">
              <TextInput value={newImage.label} onChange={(e) => setNewImage({ ...newImage, label: e.target.value })} />
            </Field>
            <ImageInput label="Image" value={newImage.src} onChange={(src) => setNewImage({ ...newImage, src })} />
            <Field label="Caption">
              <TextInput value={newImage.caption} onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })} />
            </Field>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!newImage.label || !newImage.src) return;
                  saveLibraryImage(newImage);
                  setNewImage(null);
                  refresh();
                }}
                className="rounded bg-stone-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700"
              >
                Save
              </button>
              <button onClick={() => setNewImage(null)} className="text-xs text-stone-500 hover:text-stone-800">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setNewImage(emptyImage())}
            className="mt-3 rounded border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50"
          >
            + Add image
          </button>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-stone-800">Text snippets</h2>
        <p className="mt-1 text-xs text-stone-400">
          Standard terms, materials blurbs, or any boilerplate paragraph you reuse often.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {library.snippets.map((s) => (
            <div key={s.id} className="rounded border border-stone-200 bg-white p-3">
              <div className="flex items-start justify-between">
                <div className="font-medium text-stone-800">{s.label}</div>
                <button
                  onClick={() => {
                    deleteSnippet(s.id);
                    refresh();
                  }}
                  className="text-xs text-stone-400 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
              <div className="mt-1 line-clamp-2 text-xs text-stone-500">{s.body}</div>
            </div>
          ))}
        </div>
        {newSnippet ? (
          <div className="mt-3 flex flex-col gap-3 rounded border border-stone-200 bg-white p-3">
            <Field label="Label">
              <TextInput value={newSnippet.label} onChange={(e) => setNewSnippet({ ...newSnippet, label: e.target.value })} />
            </Field>
            <Field label="Text">
              <TextArea rows={4} value={newSnippet.body} onChange={(e) => setNewSnippet({ ...newSnippet, body: e.target.value })} />
            </Field>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!newSnippet.label) return;
                  saveSnippet(newSnippet);
                  setNewSnippet(null);
                  refresh();
                }}
                className="rounded bg-stone-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700"
              >
                Save
              </button>
              <button onClick={() => setNewSnippet(null)} className="text-xs text-stone-500 hover:text-stone-800">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setNewSnippet(emptySnippet())}
            className="mt-3 rounded border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50"
          >
            + Add snippet
          </button>
        )}
      </section>
    </div>
  );
}
