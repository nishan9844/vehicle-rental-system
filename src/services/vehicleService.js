const API_URL = 'http://localhost:5000/api/admin';



export async function getVehicles() {
  const response = await fetch(`${API_URL}/vehicles`);

  if (!response.ok) {
    throw new Error('Failed to fetch vehicles');
  }

  return response.json();
}



export async function addVehicle(vehicle) {
  const response = await fetch(`${API_URL}/vehicles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(vehicle)
  });

  if (!response.ok) {
    throw new Error('Failed to add vehicle');
  }

  return response.json();
}



export async function updateVehicle(id, vehicle) {
  const response = await fetch(`${API_URL}/vehicles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(vehicle)
  });

  if (!response.ok) {
    throw new Error('Failed to update vehicle');
  }

  return response.json();
}



export async function deleteVehicle(id) {
  const response = await fetch(`${API_URL}/vehicles/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete vehicle');
  }

  return response.json();
}