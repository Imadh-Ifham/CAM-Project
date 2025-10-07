declare module "firebase/auth" {
  // Minimal shims to satisfy TS in this project; actual runtime comes from Firebase SDK
  export interface Auth {
    onAuthStateChanged?: (callback: (user: any) => void) => () => void;
  }
  export function getAuth(app?: any): Auth;
  export function setPersistence(auth: Auth, persistence: any): Promise<void>;
}
