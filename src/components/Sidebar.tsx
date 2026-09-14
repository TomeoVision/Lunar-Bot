import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block, BlockType } from "../types";
import { BLOCK_LABELS, createBlock } from "../data/blockDefaults";

function SortableRow({
  block,
  isActive,
  onSelect,
  onToggleHidden,
  onDelete,
}: {
  block: Block;
  isActive: boolean;
  onSelect: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : block.hidden ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded px-2 py-2 text-sm ${
        isActive ? "bg-stone-800 text-white" : "hover:bg-stone-100"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none px-1 text-stone-400"
        title="Drag to reorder"
      >
        ⠿
      </button>
      <button type="button" onClick={onSelect} className="flex-1 truncate text-left">
        {block.title}
      </button>
      <button
        type="button"
        onClick={onToggleHidden}
        title={block.hidden ? "Hidden — click to show" : "Visible — click to hide"}
        className={isActive ? "text-white/70 hover:text-white" : "text-stone-400 hover:text-stone-700"}
      >
        {block.hidden ? "🙈" : "👁"}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={isActive ? "text-white/70 hover:text-red-300" : "text-stone-400 hover:text-red-500"}
      >
        ✕
      </button>
    </div>
  );
}

export function Sidebar({
  blocks,
  activeId,
  onSelect,
  onReorder,
  onAdd,
  onToggleHidden,
  onDelete,
}: {
  blocks: Block[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onReorder: (blocks: Block[]) => void;
  onAdd: (block: Block) => void;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    onReorder(arrayMove(blocks, oldIndex, newIndex));
  }

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1">
            {blocks.map((block) => (
              <SortableRow
                key={block.id}
                block={block}
                isActive={block.id === activeId}
                onSelect={() => onSelect(block.id)}
                onToggleHidden={() => onToggleHidden(block.id)}
                onDelete={() => onDelete(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="relative mt-auto">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="w-full rounded border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-50"
        >
          + Add section
        </button>
        {menuOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-full rounded border border-stone-200 bg-white shadow-lg">
            {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAdd(createBlock(type));
                  setMenuOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-stone-100"
              >
                {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
