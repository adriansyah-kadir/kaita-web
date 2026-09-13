import type { Attachment } from "svelte/attachments";

export default function onFormReset(fn: () => void): Attachment {
  return (node) => {
    const form = node.closest("form")
    if (!form) return;
    form.addEventListener("reset", fn)

    return () => {
      form.removeEventListener("reset", fn)
    }
  }
}
