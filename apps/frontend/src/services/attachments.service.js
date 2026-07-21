import { postFormData } from "@core/api";

export async function uploadAttachment(reportId, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("report_id", reportId);
  return postFormData("/attachments/upload", formData);
}