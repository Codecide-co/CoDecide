import { postApiData, fetchApiData, patchApiData } from "@utils/api";

export async function createReport(data) {
  return postApiData("/reports", data);
}

export async function fetchMyReports(userId) {
  const data = await fetchApiData(`/reports?user_id=${userId}&per_page=5`);
  return data.reports;
}

export async function fetchReports(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page);
  if (params.per_page) query.set("per_page", params.per_page);
  if (params.status) query.set("status", params.status);
  if (params.category_id) query.set("category_id", params.category_id);
  if (params.date_from) query.set("date_from", params.date_from);
  if (params.date_to) query.set("date_to", params.date_to);
  return fetchApiData(`/reports?${query.toString()}`);
}

export async function updateReportStatus(reportId, status, comment) {
  const body = { status };
  if (comment) body.comment = comment;
  return patchApiData(`/reports/${reportId}/status`, body);
}

export async function voteReport(reportId, voteType) {
  return postApiData(`/reports/${reportId}/vote`, { vote_type: voteType });
}