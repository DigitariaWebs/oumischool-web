"use client";

import { X } from "lucide-react";
import { KeyboardEvent, useRef, useState } from "react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagsInput({
  value,
  onChange,
  placeholder = "Ajouter un tag…",
  maxTags = 15,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag) || value.length >= maxTags) return;
    onChange([...value, tag]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const atLimit = value.length >= maxTags;

  return (
    <div
      ref={containerRef}
      className="flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-input bg-background px-3 py-2 text-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={tag}
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            background: "oklch(0.94 0.008 80)",
            color: "oklch(0.48 0.02 250)",
          }}
        >
          {tag}
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              removeTag(i);
            }}
            className="opacity-50 transition-opacity hover:opacity-100"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}

      {!atLimit && (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-28 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
      )}

      {atLimit && value.length > 0 && (
        <span className="text-[10px] text-muted-foreground/60">
          Max {maxTags} tags
        </span>
      )}
    </div>
  );
}
