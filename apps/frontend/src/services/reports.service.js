import { postApiData } from "@utils/api";

export async function createReport(data) {
  return postApiData("/reports", data);
}
