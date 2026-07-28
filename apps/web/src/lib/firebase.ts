const DEV_TOKEN_KEY = "clare_dev_token";
const DEV_ROLE_KEY = "clare_dev_role";
const FIREBASE_SESSION_KEY = "clare_firebase_session";

export type DevRole = "student" | "teacher" | "admin";

export const firebaseEnabled =
  Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo";

export function setDevSession(role: DevRole) {
  const map: Record<DevRole, string> = {
    admin: "dev:dev-admin:admin@stclare.local",
    teacher: "dev:dev-teacher:teacher@stclare.local",
    student: "dev:dev-student:student@stclare.local",
  };
  localStorage.setItem(DEV_TOKEN_KEY, map[role]);
  localStorage.setItem(DEV_ROLE_KEY, role);
}

export function clearDevSession() {
  localStorage.removeItem(DEV_TOKEN_KEY);
  localStorage.removeItem(DEV_ROLE_KEY);
  localStorage.removeItem(FIREBASE_SESSION_KEY);
}

export function getDevToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DEV_TOKEN_KEY);
}

async function loadFirebase() {
  const [{ initializeApp, getApps }, authMod] = await Promise.all([
    import("firebase/app"),
    import("firebase/auth"),
  ]);
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo",
  };
  const app = getApps().length ? getApps()[0] : initializeApp(config);
  return { app, auth: authMod.getAuth(app), authMod };
}

export async function getIdToken(): Promise<string | null> {
  if (!firebaseEnabled) {
    return getDevToken();
  }
  try {
    const { auth } = await loadFirebase();
    const user = auth.currentUser;
    if (!user) return getDevToken();
    return user.getIdToken();
  } catch {
    return getDevToken();
  }
}

export async function loginEmail(email: string, password: string) {
  if (!firebaseEnabled) {
    throw new Error("Firebase is not configured. Use a demo role login instead.");
  }
  const { auth, authMod } = await loadFirebase();
  const cred = await authMod.signInWithEmailAndPassword(auth, email, password);
  localStorage.setItem(FIREBASE_SESSION_KEY, "1");
  return cred;
}

export async function registerEmail(email: string, password: string) {
  if (!firebaseEnabled) {
    throw new Error("Firebase is not configured. Use a demo role login instead.");
  }
  const { auth, authMod } = await loadFirebase();
  const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
  localStorage.setItem(FIREBASE_SESSION_KEY, "1");
  return cred;
}

export async function logout() {
  clearDevSession();
  if (!firebaseEnabled) return;
  try {
    const { auth, authMod } = await loadFirebase();
    await authMod.signOut(auth);
  } catch {
    // ignore when firebase package/config unavailable
  }
}
