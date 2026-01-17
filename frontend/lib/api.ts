import { auth } from "./firebase";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const user = auth.currentUser;

  let token = "";
  if (user) {
    token = await user.getIdToken(true); // 🔥 FORCE REFRESH
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : ""
      }
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res;
}
