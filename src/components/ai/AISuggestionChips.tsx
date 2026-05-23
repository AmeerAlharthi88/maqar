"use client";

interface AISuggestionChipsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  label?: string;
}

export function AISuggestionChips({ prompts, onSelect, disabled = false, label = "اقتراحات" }: AISuggestionChipsProps) {
  if (prompts.length === 0) return null;

  return (
    <div dir="rtl">
      {label && <p className="text-[10px] font-bold text-[#627D98] mb-2">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(prompt)}
            disabled={disabled}
            className="px-3 py-2 text-xs text-right rounded-xl border border-[#E2E8F0] bg-white text-[#102A43] hover:border-[#0A3C36] hover:bg-[#E6F0EF] hover:text-[#0A3C36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
