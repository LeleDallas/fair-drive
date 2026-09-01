const API_URL = "https://fair-drive-api.emanuele-dallara.workers.dev";

const SESSION_KEY = "fair-drive_admin_session";

export async function adminLogin(password: string): Promise<void> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "Login fallito");
  }

  localStorage.setItem(SESSION_KEY, result.session);
}

export function isAdmin(): boolean {
  return Boolean(localStorage.getItem(SESSION_KEY));
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function saveData(data: unknown): Promise<void> {
  const session = localStorage.getItem(SESSION_KEY);

  if (!session) {
    throw new Error("Non sei autenticato");
  }

  const response = await fetch(`${API_URL}/save`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${session}`,
    },

    body: JSON.stringify({
      data,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      logout();
    }

    throw new Error(result.error ?? "Errore durante il salvataggio");
  }
}
