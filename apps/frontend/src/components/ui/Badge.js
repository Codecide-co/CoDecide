const STATUS_COLORS = {
  open: { bg: "#FEF3C7", color: "#92400E" },
  in_progress: { bg: "#EDE9FE", color: "#6D28D9" },
  resolved: { bg: "#DCFCE7", color: "#166534" },
  closed: { bg: "#F1F5F9", color: "#475569" },
};

export function Badge(status) {
  const colors = STATUS_COLORS[status] || { bg: "#F1F5F9", color: "#475569" };
  const label = status.replace("_", " ");
  return `
    <span style="
      display: inline-block;
      padding: 3px 12px;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: ${colors.bg};
      color: ${colors.color};
      white-space: nowrap;
    ">${label}</span>
  `;
}