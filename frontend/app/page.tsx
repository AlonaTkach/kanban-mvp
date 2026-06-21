import { Board } from "@/components/Board";
import { BoardProvider } from "@/lib/boardContext";

export default function Home() {
  return (
    <BoardProvider>
      <main className="min-h-screen flex flex-col">
        <header className="px-8 pt-8 pb-5">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[color:var(--color-accent)] via-[color:var(--color-text)] to-[color:var(--color-primary)] bg-clip-text text-transparent">
              Kanban
            </h1>
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
          </div>
          <p className="text-sm text-[color:var(--color-text-muted)] mt-1.5">
            One board. Five columns. Drag cards to move them.
          </p>
        </header>
        <Board />
      </main>
    </BoardProvider>
  );
}
