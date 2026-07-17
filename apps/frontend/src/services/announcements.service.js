import { postApiData } from "@utils/api";

export async function createAnnouncement(title, body) {
  return postApiData("/comunicados", { title, body });
}