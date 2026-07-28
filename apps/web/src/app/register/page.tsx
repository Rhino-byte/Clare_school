import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <section className="section">
          <div className="container-page">Loading enrolment…</div>
        </section>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
