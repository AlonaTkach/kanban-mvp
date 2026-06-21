import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EditableTitle } from "@/components/EditableTitle";

describe("EditableTitle", () => {
  it("renders the value as a button initially", () => {
    render(
      <EditableTitle value="Backlog" ariaLabel="col" onCommit={() => {}} />,
    );
    expect(
      screen.getByRole("button", { name: /rename: col/i }),
    ).toHaveTextContent("Backlog");
  });

  it("commits a new value on Enter", async () => {
    const onCommit = vi.fn();
    render(
      <EditableTitle value="Old" ariaLabel="col" onCommit={onCommit} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /rename: col/i }));
    const input = screen.getByLabelText("col");
    await userEvent.clear(input);
    await userEvent.type(input, "New name{Enter}");
    expect(onCommit).toHaveBeenCalledWith("New name");
  });

  it("commits on blur", async () => {
    const onCommit = vi.fn();
    render(
      <>
        <EditableTitle value="Old" ariaLabel="col" onCommit={onCommit} />
        <button>elsewhere</button>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: /rename: col/i }));
    const input = screen.getByLabelText("col");
    await userEvent.clear(input);
    await userEvent.type(input, "Blurred");
    await userEvent.click(screen.getByRole("button", { name: /elsewhere/i }));
    expect(onCommit).toHaveBeenCalledWith("Blurred");
  });

  it("does not commit on Escape", async () => {
    const onCommit = vi.fn();
    render(
      <EditableTitle value="Old" ariaLabel="col" onCommit={onCommit} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /rename: col/i }));
    const input = screen.getByLabelText("col");
    await userEvent.clear(input);
    await userEvent.type(input, "Cancelled{Escape}");
    expect(onCommit).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /rename: col/i }),
    ).toHaveTextContent("Old");
  });

  it("rejects empty titles", async () => {
    const onCommit = vi.fn();
    render(
      <EditableTitle value="Old" ariaLabel="col" onCommit={onCommit} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /rename: col/i }));
    const input = screen.getByLabelText("col");
    await userEvent.clear(input);
    await userEvent.type(input, "   {Enter}");
    expect(onCommit).not.toHaveBeenCalled();
  });
});
