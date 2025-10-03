// Firebase client initialization for Expo/React Native
import { initializeApp } from "firebase/app";

// You can move these to EXPO_PUBLIC_ env vars later if preferred
const firebaseConfig = {
  apiKey: "AIzaSyBt5xVe5_NkjKZfCNWt04CIXm2zl3gYikU",
  authDomain: "cam-app-55357.firebaseapp.com",
  projectId: "cam-app-55357",
  storageBucket: "cam-app-55357.firebasestorage.app",
  messagingSenderId: "163132893867",
  appId: "1:163132893867:web:fab21296da9be0259625ee",
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence via dynamic requires to avoid TS/packager issues
let auth: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { initializeAuth } = require("firebase/auth");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getReactNativePersistence } = require("firebase/auth/react-native");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Fallback to default auth if RN persistence isn't available
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getAuth } = require("firebase/auth");
  auth = getAuth(app);
}

export { app, auth };
