"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

type Props = {
  columnName: string;
  onSubmit: (title: string, details: string) => void;
};

export function AddCardForm({ columnName, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      setTimeout(() => titleRef.current?.focus(), 0);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function close() {
    setTitle("");
    setDetails("");
    setOpen(false);
  }

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed, details.trim());
    close();
  }

  function onDetailsKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function onBackdropClick(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[color:var(--color-text-muted)] hover:text-[color:var(--color-accent)] hover:bg-[color:var(--color-primary)]/15 border border-transparent hover:border-[color:var(--color-primary)]/40 transition-all"
      >
        <span className="text-[color:var(--color-accent)] mr-1">+</span> Add card
      </button>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={onBackdropClick}
        aria-labelledby="add-card-heading"
        className="m-auto rounded-2xl bg-transparent p-0 max-w-lg w-[calc(100%-2rem)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)] shadow-2xl overflow-hidden"
        >
          <div
            aria-hidden
            className="h-1 w-full bg-gradient-to-r from-[color:var(--color-primary)] via-[color:var(--color-accent)] to-[color:var(--color-primary)]"
          />
          <div className="p-6 flex flex-col gap-5">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                Add card to
              </div>
              <h2
                id="add-card-heading"
                className="text-xl font-semibold mt-1 text-[color:var(--color-text)]"
              >
                {columnName}
              </h2>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
                Title
              </span>
              <input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to happen?"
                className="rounded-lg bg-[color:var(--color-background)] border border-[color:var(--color-border)] focus:border-[color:var(--color-primary)] px-3 py-2.5 text-sm placeholder:text-[color:var(--color-text-muted)]/60 outline-none transition-colors"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
                Description
                <span className="ml-2 font-normal normal-case tracking-normal text-[color:var(--color-text-muted)]/60">
                  optional
                </span>
              </span>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                onKeyDown={onDetailsKeyDown}
                placeholder="Add more context, links, acceptance criteria..."
                rows={5}
                className="rounded-lg bg-[color:var(--color-background)] border border-[color:var(--color-border)] focus:border-[color:var(--color-primary)] px-3 py-2.5 text-sm placeholder:text-[color:var(--color-text-muted)]/60 outline-none transition-colors resize-none leading-relaxed"
              />
              <span className="text-[11px] text-[color:var(--color-text-muted)]/70">
                Tip: press <kbd className="px-1 py-0.5 rounded bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[10px]">⌘</kbd>
                <kbd className="px-1 py-0.5 rounded bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[10px] ml-1">Enter</kbd> to add
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-elevated)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-hover)] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_-4px_rgba(109,40,217,0.6)] transition-all"
              >
                Add card
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
}
