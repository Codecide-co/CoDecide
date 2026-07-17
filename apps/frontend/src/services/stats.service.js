import { fetchApiData } from "@utils/api";

export async function fetchCommunityStats() {
  return fetchApiData("/stats");
}

export async function fetchReportsOverTime(days = 30) {
  return fetchApiData(`/stats/reports-over-time?days=${days}`);
}

export async function fetchTopVotedReports(limit = 10) {
  return fetchApiData(`/stats/top-voted-reports?limit=${limit}`);
}
