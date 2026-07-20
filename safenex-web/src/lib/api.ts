const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getLocations() {
  const response = await fetch(`${API_URL}/api/v1/locations`);
  return response.json();
}

export async function sendSOS(data: any) {
  const response = await fetch(`${API_URL}/api/v1/sos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}