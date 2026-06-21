import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { AddCardForm } from "@/components/AddCardForm";

beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }
});

describe("AddCardForm", () => {
  it("opens the dialog when the trigger is clicked", async () => {
    render(<AddCardForm columnName="To Do" onSubmit={() => {}} />);
    await userEvent.click(
      screen.getByRole("button", { name: /add card/i }),
    );
    expect(screen.getByRole("heading", { name: "To Do" })).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("submits a trimmed title and details", async () => {
    const onSubmit = vi.fn();
    render(<AddCardForm columnName="To Do" onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: /add card/i }));
    await userEvent.type(screen.getByLabelText("Title"), "  Buy milk  ");
    await userEvent.type(
      screen.getByLabelText(/description/i),
      "Two percent",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /^Add card$/ }),
    );
    expect(onSubmit).toHaveBeenCalledWith("Buy milk", "Two percent");
  });

  it("ignores submit when title is empty", async () => {
    const onSubmit = vi.fn();
    render(<AddCardForm columnName="To Do" onSubmit={onSubmit} />);
    await userEvent.click(
      screen.getByRole("button", { name: /^\+ add card$/i }),
    );
    const submit = screen.getByRole("button", { name: /^Add card$/ });
    expect(submit).toBeDisabled();
    await userEvent.click(submit);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("cancels and closes when Cancel is clicked", async () => {
    render(<AddCardForm columnName="To Do" onSubmit={() => {}} />);
    await userEvent.click(
      screen.getByRole("button", { name: /^\+ add card$/i }),
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("open");
    await userEvent.type(screen.getByLabelText("Title"), "Half-typed");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(dialog).not.toHaveAttribute("open");
  });

  it("submits via Cmd+Enter from the description field", async () => {
    const onSubmit = vi.fn();
    render(<AddCardForm columnName="To Do" onSubmit={onSubmit} />);
    await userEvent.click(
      screen.getByRole("button", { name: /^\+ add card$/i }),
    );
    await userEvent.type(screen.getByLabelText("Title"), "Title");
    const details = screen.getByLabelText(/description/i);
    await userEvent.type(details, "Some detail");
    await userEvent.keyboard("{Meta>}{Enter}{/Meta}");
    expect(onSubmit).toHaveBeenCalledWith("Title", "Some detail");
  });
});
