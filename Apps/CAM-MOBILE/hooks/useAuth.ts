import { useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState<null | { name: string }>(null);

  const login = (name: string) => setUser({ name });
  const logout = () => setUser(null);

  return { user, login, logout };
}
