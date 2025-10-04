declare module "firebase/auth" {
  export function initializeAuth(
    app: any,
    options?: { persistence?: any }
  ): any;
}

declare module "firebase/auth" {
  import type { Persistence } from "firebase/auth";
  export function getReactNativePersistence(storage: any): Persistence;
}
