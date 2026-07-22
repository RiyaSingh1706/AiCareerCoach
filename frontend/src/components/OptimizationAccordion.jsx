import { useState } from "react";
import { ChevronDown, Sparkles, Copy, Check } from "lucide-react";

function AccordionItem({ index, suggestion, isOpen, onToggle }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(suggestion.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="border-b border-border-soft last:border-b-0">
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center gap-2.5 px-3 py-4 sm:gap-3 sm:px-5"
      >
        <span className="hidden w-[18px] shrink-0 text-[11px] font-bold text-ink-400 sm:block">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Sparkles size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold text-ink-900">{suggestion.title}</div>
          <div className="mt-px truncate text-[12px] text-ink-400">{suggestion.subtitle}</div>
        </div>
        <span className="ml-auto hidden shrink-0 rounded-md bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success sm:inline-block">
          {suggestion.impact}
        </span>
        <ChevronDown
          size={16}
          className={`ml-1 shrink-0 text-ink-400 transition-transform duration-200 sm:ml-2.5 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      <div
        className="overflow-hidden px-3 transition-[max-height] duration-200 sm:px-5"
        style={{ maxHeight: isOpen ? 260 : 0 }}
      >
        <div className="flex flex-col gap-2.5 py-0 pb-[18px] pl-0 sm:pl-[62px]">
          <span className="w-fit rounded-md bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success sm:hidden">
            {suggestion.impact}
          </span>
          <p className="max-w-[640px] text-[13px] leading-relaxed text-ink-700">
            {suggestion.body}
          </p>
          <button
            onClick={handleCopy}
            className="flex w-fit items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-ink-700 hover:bg-canvas"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy suggestion"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OptimizationAccordion({ suggestions }) {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="col-span-full rounded-xl border border-border bg-card shadow-sm">
      {suggestions.map((s, i) => (
        <AccordionItem
          key={s.title}
          index={i}
          suggestion={s}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
