import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "hasLaunchedOnce";

export async function hasLaunchedBefore(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(KEY);
    return v === "true";
  } catch {
    return false;
  }
}

export async function setLaunched(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, "true");
  } catch {}
}
