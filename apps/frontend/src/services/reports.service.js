import { postApiData, fetchApiData } from "@utils/api";

export async function createReport(data) {
  return postApiData("/reports", data);
}

export async function fetchMyReports(userId) {
  const data = await fetchApiData(`/reports?user_id=${userId}&per_page=5`);
  return data.reports;
}