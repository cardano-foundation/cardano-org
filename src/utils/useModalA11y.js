import { useEffect, useRef } from "react";

// Elements considered focusable for the modal focus trap.
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// Accessible-dialog behavior shared by the Quiz and Survey modals:
//  - locks background scroll while open
//  - moves focus into the dialog on open
//  - traps Tab / Shift+Tab within the dialog
//  - closes on Escape
//  - restores focus to the triggering element on close
//
// Attach the returned ref to the dialog container (give it tabIndex={-1} so it
// can receive focus when it holds no focusable children).
export default function useModalA11y(isOpen, onClose) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  // Keep the latest onClose without making it an effect dependency, so the main
  // effect runs once per open/close rather than on every parent render (which
  // would steal and mis-restore focus).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    // Remember what had focus so we can restore it when the dialog closes.
    triggerRef.current =
      typeof document !== "undefined" ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    // Move focus into the dialog (first focusable, else the container itself).
    const initial = dialog?.querySelector(FOCUSABLE_SELECTOR) || dialog;
    initial?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const focusable = dialog.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      const trigger = triggerRef.current;
      if (trigger && typeof trigger.focus === "function") trigger.focus();
    };
  }, [isOpen]);

  return dialogRef;
}
