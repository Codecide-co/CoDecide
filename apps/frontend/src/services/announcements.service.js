import { postApiData } from "@core/api";

export async function createAnnouncement(title, body) {
  return postApiData("/comunicados", { title, body });
}