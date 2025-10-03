import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { hasLaunchedBefore } from "../src/utils/firstLaunch";

export default function Index() {
  const [firstCheck, setFirstCheck] = useState<null | boolean>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const launched = await hasLaunchedBefore();
      setFirstCheck(launched);
    })();
  }, []);

  useEffect(() => {
    if (firstCheck === null) return;
    if (firstCheck) router.replace("/(auth)");
    else router.replace("/splash" as any);
  }, [firstCheck, router]);

  return null;
}
