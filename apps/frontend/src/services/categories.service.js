import { fetchApiData } from "@utils/api";

const USE_MOCK = import.meta.env.VITE_MOCK_API === "true";

const MOCK_CATEGORIES = [
  { id: "utilities", name: "Public Utilities" },
  { id: "coexistence", name: "Coexistence" },
  { id: "security", name: "Security" },
  { id: "maintenance", name: "Maintenance" },
  { id: "other", name: "Other" },
];

function mockGetCategories() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CATEGORIES), 400);
  });
}

export async function getCategories() {
  if (USE_MOCK) return mockGetCategories();
  return fetchApiData("/api/categories");
}
