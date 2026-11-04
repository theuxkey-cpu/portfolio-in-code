import { useRef, type RefObject } from "react"

/**
 * Focus-restore for a Dialog with no <DialogTrigger> (Radix can't return
 * focus on its own): back to `triggerRef` after Cancel/Esc, or to
 * `headingRef` after a confirmed action whose result makes the trigger
 * disappear or disable (the selection it opened from is gone by then).
 *
 * Call `confirm()` right before the confirming action closes the dialog;
 * spread `onCloseAutoFocus` onto <DialogContent>.
 */
export function useConfirmFocus({
  headingRef,
  triggerRef,
}: {
  headingRef: RefObject<HTMLElement | null>
  triggerRef: RefObject<HTMLElement | null>
}) {
  const confirmed = useRef(false)

  return {
    confirm: () => {
      confirmed.current = true
    },
    onCloseAutoFocus: (event: Event) => {
      event.preventDefault()
      const target = confirmed.current ? headingRef.current : triggerRef.current
      confirmed.current = false
      target?.focus()
    },
  }
}
