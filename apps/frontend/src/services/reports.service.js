import { postFormData } from "@utils/api";

const USE_MOCK = import.meta.env.VITE_MOCK_API === "true";

function mockCreateReport(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `mock-${Date.now()}`,
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        anonymous: formData.get("anonymous") === "true",
        photoCount: formData.getAll("photos").length,
        createdAt: new Date().toISOString(),
      });
    }, 900);
  });
}

export async function createReport(formData) {
  if (USE_MOCK) return mockCreateReport(formData);
  return postFormData("/api/reports", formData);
}
