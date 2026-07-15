const API_URL = "http://localhost:3000";

export async function fetchApiData(path) {
  const response = await fetch(API_URL + path);
  const data = await response.json();

  return data;
}

export async function postApiData(path, data) {
  const response = await fetch(API_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function postFormData(path, formData) {
  const response = await fetch(API_URL + path, {
    method: "POST",
    body: formData,
  });

  return await response.json();
}

export async function updateApiData(path, data) {
  const response = await fetch(API_URL + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function deleteApiData(path) {
  await fetch(API_URL + path, {
    method: "DELETE",
  });
}