import { redirect } from "next/navigation";

/** About is the landing page — keep /about for bookmarks and old links. */
export default function AboutPage() {
  redirect("/");
}
