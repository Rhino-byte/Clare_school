export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Course = {
  id: string;
  language: string;
  level: string;
  title: string;
  description: string;
  delivery_modes: string;
  is_active: boolean;
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "teacher" | "admin";
  firebase_uid: string;
};

export type Module = {
  id: string;
  course_id: string;
  author_id: string | null;
  title: string;
  summary: string;
  content_json: Array<Record<string, unknown>>;
  status: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: string;
  question_type: "mcq" | "true_false" | "short_answer" | "audio_response";
  prompt: string;
  options: string[];
  audio_prompt_key: string | null;
  points: number;
  order_index: number;
};

export type Test = {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  instructions: string;
  status: string;
  questions: Question[];
};

function authHeader(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string, token?: string | null): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { ...authHeader(token) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiSend<T>(
  path: string,
  method: string,
  body?: unknown,
  token?: string | null,
): Promise<T> {
  const headers: HeadersInit = {
    ...authHeader(token),
  };
  const init: RequestInit = { method, headers };
  if (body !== undefined) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`${API_URL}/api${path}`, init);
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export function languageLabel(lang: string) {
  return lang.charAt(0).toUpperCase() + lang.slice(1);
}
