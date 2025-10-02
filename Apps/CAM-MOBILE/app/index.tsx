import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the auth landing screen (route group at top level)
    router.replace("/(auth)" as any);
  }, [router]);
  return null;
}
