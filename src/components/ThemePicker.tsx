import { THEME_LIST } from "../data/themes";
import type { ThemeId } from "../types";

export function ThemePicker({
  value,
  onChange,
}: {
  value: ThemeId;
  onChange: (id: ThemeId) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {THEME_LIST.map((theme) => (
        <button
          key={theme.id}
          type="button"
          title={theme.label}
          onClick={() => onChange(theme.id)}
          className={`h-6 w-6 rounded-full border-2 ${
            value === theme.id ? "border-stone-800" : "border-transparent"
          }`}
          style={{ background: theme.accent }}
        />
      ))}
    </div>
  );
}
