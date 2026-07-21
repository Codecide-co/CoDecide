import { openModal } from "@components/ui/Modal";
import { updateReportStatus } from "@services/reports.service";
import { fetchApiData, postApiData } from "@core/api";
import { formatDate } from "@core/helpers";
import { createAnnouncement } from "@services/announcements.service";
import { t } from "@core/i18n";
import { toast } from "@core/toast";

export function showStatusChangeModal(reportId, newStatus, onComplete) {
  openModal({
    title: t("admin.change_status_title"),
    submitLabel: t("admin.change_status_submit"),
    content: `
      <p class="mb-4">${t("admin.change_status_to", { status: newStatus.replace("_", " ") })}</p>
      <form id="status-change-form">
        <label class="block mb-1">${t("admin.change_status_comment")}</label>
        <textarea name="comment" rows="3" class="w-full resize-y"></textarea>
      </form>
    `,
    onSubmit: async (data) => {
      await updateReportStatus(reportId, newStatus, data.comment || "");
      toast(t("admin.status_updated"), "success");
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
          title: t("admin.status_history"),
          content: `<p class="text-center p-8">${t("admin.status_history_empty")}</p>`,
          submitLabel: t("admin.close"),
          onSubmit: () => {},
          cancellable: false,
        });
        return;
      }
      const list = history.map((h) => {
        const from = h.details?.from || "—";
        const to = h.details?.to || "—";
        const comment = h.details?.comment || "";
        const date = formatDate(h.created_at, "full");
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
        title: t("admin.status_history"),
        content: `<div class="flex flex-col max-h-96 overflow-y-auto">${list}</div>`,
        submitLabel: t("admin.close"),
        onSubmit: () => {},
      });
    })
    .catch(() => {
      openModal({
        title: t("admin.status_history"),
        content: `<p class="text-center p-8">${t("admin.status_history_error")}</p>`,
        submitLabel: t("admin.close"),
        onSubmit: () => {},
      });
    });
}

export function showAnnouncementModal() {
  openModal({
    title: t("admin.announcement_title"),
    submitLabel: t("admin.announcement_submit"),
    content: `
      <form id="announcement-form">
        <label class="block mb-1">${t("admin.announcement_label")}</label>
        <input name="title" type="text" class="w-full mb-4">
        <label class="block mb-1">${t("admin.announcement_body")}</label>
        <textarea name="body" rows="4" class="w-full resize-y"></textarea>
      </form>
    `,
    onSubmit: async (data) => {
      if (!data.title || !data.body) throw new Error(t("admin.announcement_required"));
      await createAnnouncement(data.title, data.body);
      toast(t("admin.announcement_created"), "success");
    },
  });
}

export function showCategoryModal(onCreated) {
  openModal({
    title: t("admin.category_title"),
    submitLabel: t("admin.category_submit"),
    content: `
      <form id="category-form">
        <label class="block mb-1">${t("admin.category_name")}</label>
        <input name="name" type="text" class="w-full mb-4" required>
        <label class="block mb-1">${t("admin.category_type")}</label>
        <select name="type" class="w-full mb-4">
          <option value="infrastructure">${t("admin.category_infrastructure")}</option>
          <option value="coexistence">${t("admin.category_coexistence")}</option>
        </select>
        <label class="block mb-1">${t("admin.category_desc")}</label>
        <textarea name="description" rows="2" class="w-full resize-y"></textarea>
      </form>
    `,
    onSubmit: async (data) => {
      if (!data.name) throw new Error(t("admin.category_name_required"));
      await postApiData("/categories", {
        name: data.name,
        type: data.type,
        description: data.description || "",
      });
      toast(t("admin.category_created"), "success");
      const cats = await fetchApiData("/categories");
      if (onCreated) onCreated(cats);
    },
  });
}