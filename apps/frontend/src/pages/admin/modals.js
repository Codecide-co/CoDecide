import { openModal } from "@components/ui/Modal";
import { updateReportStatus } from "@services/reports.service";
import { fetchApiData, postApiData } from "@core/api";
import { createAnnouncement } from "@services/announcements.service";

export function showStatusChangeModal(reportId, newStatus, onComplete) {
  openModal({
    title: "Change Status",
    submitLabel: "Update Status",
    content: `
      <p class="mb-4">Change to: <strong>${newStatus.replace("_", " ")}</strong></p>
      <form id="status-change-form">
        <label class="block mb-1">Internal comment (optional)</label>
        <textarea name="comment" rows="3" class="w-full resize-y"></textarea>
      </form>
    `,
    onSubmit: async (data) => {
      await updateReportStatus(reportId, newStatus, data.comment || "");
      onComplete();
    },
    onCancel: onComplete,
  });
}

export function showHistoryModal(reportId) {
  fetchApiData(`/reports/${reportId}`)
    .then((report) => {
      const history = report.status_history || [];
      if (history.length === 0) {
        openModal({
          title: "Status History",
          content: `<p class="text-center p-8">No status changes recorded.</p>`,
          submitLabel: "Close",
          onSubmit: () => {},
          cancellable: false,
        });
        return;
      }
      const list = history.map((h) => {
        const from = h.details?.from || "—";
        const to = h.details?.to || "—";
        const comment = h.details?.comment || "";
        const date = new Date(h.created_at).toLocaleString();
        return `
          <div class="flex items-start gap-4 p-4">
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full"></div>
              <div class="w-0.5 flex-1"></div>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="admin-status-badge ${from}">${from.replace("_", " ")}</span>
                <span>→</span>
                <span class="admin-status-badge ${to}">${to.replace("_", " ")}</span>
              </div>
              <p class="mt-1">${date}</p>
              ${comment ? `<p class="mt-1">${comment}</p>` : ""}
            </div>
          </div>
        `;
      }).join("");

      openModal({
        title: "Status History",
        content: `<div class="flex flex-col max-h-96 overflow-y-auto">${list}</div>`,
        submitLabel: "Close",
        onSubmit: () => {},
      });
    })
    .catch(() => {
      openModal({
        title: "Status History",
        content: `<p class="text-center p-8">Could not load history.</p>`,
        submitLabel: "Close",
        onSubmit: () => {},
      });
    });
}

export function showAnnouncementModal() {
  openModal({
    title: "New Announcement",
    submitLabel: "Publish",
    content: `
      <form id="announcement-form">
        <label class="block mb-1">Title</label>
        <input name="title" type="text" class="w-full mb-4">
        <label class="block mb-1">Body</label>
        <textarea name="body" rows="4" class="w-full resize-y"></textarea>
      </form>
    `,
    onSubmit: async (data) => {
      if (!data.title || !data.body) throw new Error("Title and body are required.");
      await createAnnouncement(data.title, data.body);
    },
  });
}

export function showCategoryModal(onCreated) {
  openModal({
    title: "New Category",
    submitLabel: "Create Category",
    content: `
      <form id="category-form">
        <label class="block mb-1">Name</label>
        <input name="name" type="text" class="w-full mb-4" required>
        <label class="block mb-1">Type</label>
        <select name="type" class="w-full mb-4">
          <option value="infrastructure">Infrastructure</option>
          <option value="coexistence">Coexistence</option>
        </select>
        <label class="block mb-1">Description (optional)</label>
        <textarea name="description" rows="2" class="w-full resize-y"></textarea>
      </form>
    `,
    onSubmit: async (data) => {
      if (!data.name) throw new Error("Name is required.");
      await postApiData("/categories", {
        name: data.name,
        type: data.type,
        description: data.description || "",
      });
      const cats = await fetchApiData("/categories");
      if (onCreated) onCreated(cats);
    },
  });
}