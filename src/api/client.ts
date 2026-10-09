import type { ApiError, LoginRequest } from "../types/auth";

export async function requestLogin(request: LoginRequest): Promise<ApiError> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const body = (await response.json().catch(() => ({
    message: "The server returned an unexpected response.",
  }))) as ApiError;

  if (!response.ok) {
    throw new Error(body.message || "Login is not available right now.");
  }

  return body;
}
