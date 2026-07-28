# Launch checklist — St. Clare Language Institute

## Infrastructure

- [ ] Postgres provisioned (Railway/Render/Neon) and `DATABASE_URL` set on API
- [ ] Cloudflare R2 bucket created with prefixes `lessons/`, `prompts/`, `submissions/`
- [ ] R2 lifecycle rule for `submissions/` retention (align with privacy policy)
- [ ] Firebase project: Email/Password auth enabled; Admin SDK credentials on API
- [ ] Next.js env: `NEXT_PUBLIC_API_URL`, Firebase public config, `NEXT_PUBLIC_SITE_URL`
- [ ] `AUTH_DEV_BYPASS=false` in production
- [ ] CORS origins limited to production web domain

## Product QA

- [ ] Public pages load &lt; 3s on a standard connection
- [ ] Course catalogue shows German/French A1–B2 and all English levels
- [ ] Registration requires in-person attendance acknowledgement
- [ ] Contact form stores inquiry (and email route if SMTP configured)
- [ ] Student can open assigned modules and mark complete
- [ ] Teacher can create/publish module with media upload
- [ ] Student can submit MCQ + short answer + audio response
- [ ] Teacher can play audio and grade pending answers
- [ ] Gradebook shows per-student results
- [ ] Admin can change roles and edit About / Schedule / Testimonials

## Compliance & content

- [ ] Privacy notice covering Kenya Data Protection Act (2019)
- [ ] Audio/test retention policy published and enforced in R2 lifecycle
- [ ] Machine-translation disclaimer on relevant course content
- [ ] Human review of MT content before Publish
- [ ] Accessibility spot-check (keyboard nav, contrast, form labels)

## Go-live

- [ ] Production DNS + HTTPS
- [ ] Smoke test student/teacher/admin journeys
- [ ] Backup/restore verified for Postgres
- [ ] Monitoring/uptime alerts for API during class hours
