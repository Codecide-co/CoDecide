import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({
  duration: 4000,
  position: { x: "right", y: "top" },
  types: [
    {
      type: "warning",
      background: "#d97706",
      icon: false,
    },
  ],
});

export function toast(message, type = "error", duration) {
  if (duration) notyf.dismissAll();
  notyf.open({ type, message, duration });
}
