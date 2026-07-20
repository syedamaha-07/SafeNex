const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateLocation(data: any) {
  const response = await fetch(
    `${API_URL}/api/v1/locations/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}


export async function triggerSOS(userId: number) {
  const response = await fetch(
    `${API_URL}/api/v1/sos/trigger`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId
      }),
    }
  );

  return response.json();
}