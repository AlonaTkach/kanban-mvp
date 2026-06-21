"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type Props = {
  value: string;
  onCommit: (next: string) => void;
  ariaLabel: string;
  className?: string;
};

export function EditableTitle({ value, onCommit, ariaLabel, className }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startEditing() {
    setDraft(value);
    setEditing(true);
  }

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onCommit(trimmed);
    setEditing(false);
  }

  function cancel() {
    setEditing(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        aria-label={ariaLabel}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        className={`bg-transparent border-b border-[color:var(--color-primary)] outline-none w-full ${className ?? ""}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      aria-label={`Rename: ${ariaLabel}`}
      className={`text-left w-full hover:text-[color:var(--color-accent)] transition-colors cursor-text ${className ?? ""}`}
    >
      {value}
    </button>
  );
}
