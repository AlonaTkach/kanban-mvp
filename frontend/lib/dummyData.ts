import type { BoardState } from "./types";

export const COLUMN_IDS = [
  "col-backlog",
  "col-todo",
  "col-in-progress",
  "col-review",
  "col-done",
] as const;

export const dummyBoard: BoardState = {
  columns: [
    { id: "col-backlog", title: "Backlog", cardIds: ["c1", "c2", "c3"] },
    { id: "col-todo", title: "To Do", cardIds: ["c4", "c5"] },
    { id: "col-in-progress", title: "In Progress", cardIds: ["c6", "c7"] },
    { id: "col-review", title: "Review", cardIds: ["c8"] },
    { id: "col-done", title: "Done", cardIds: ["c9", "c10"] },
  ],
  cards: {
    c1: {
      id: "c1",
      title: "Define onboarding flow",
      details: "Sketch the first-run experience and welcome screens.",
    },
    c2: {
      id: "c2",
      title: "Audit current color tokens",
      details: "Catalog every hex value in use and propose a unified palette.",
    },
    c3: {
      id: "c3",
      title: "Draft pricing page copy",
      details: "Three tiers, annual discount, FAQ section underneath.",
    },
    c4: {
      id: "c4",
      title: "Wire up auth provider",
      details: "Evaluate options and decide before the Friday sync.",
    },
    c5: {
      id: "c5",
      title: "Replace marketing hero",
      details: "New illustration plus a tighter sub-headline.",
    },
    c6: {
      id: "c6",
      title: "Build settings page",
      details: "Profile, notifications, billing tabs. Keep the layout calm.",
    },
    c7: {
      id: "c7",
      title: "Migrate email templates",
      details: "Move legacy MJML files into the new design system.",
    },
    c8: {
      id: "c8",
      title: "Review Q3 roadmap doc",
      details: "Pass back comments before the leadership review on Thursday.",
    },
    c9: {
      id: "c9",
      title: "Ship dark-mode toggle",
      details: "Persisted to localStorage, respects system preference.",
    },
    c10: {
      id: "c10",
      title: "Launch changelog page",
      details: "First post covers the November release notes.",
    },
  },
};
