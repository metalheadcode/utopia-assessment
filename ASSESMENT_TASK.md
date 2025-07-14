# Programmer Assessment – WebApp Challenge Brief

## 🔖 Company Overview

**Company:** Sejuk Sejuk Service Sdn Bhd (fictional name)

We provide air-conditioner installation, servicing and repair for homes and businesses.

- 5 branches nationwide
- 20+ technician teams on the ground
- Admins work on desktop; technicians use mobile devices

**Goal:** digitise the full workflow — order ➝ assignment ➝ completion ➝ manager / accounts review

## ✍️ What's this assessment about?

We want to see whether you can:

- Build real-world business logic into a WebApp
- Think in systems, not just pages
- Communicate your code and ideas clearly

You may complete one, two, or all three modules. Focus on your strengths (frontend or backend). We care most about how you think and solve problems.

## 🛠 Suggested Tech Stack

*[Note: Tech stack section appears to be empty in the original document]*

## 🧭 Quick System Flow

1. Admin creates an order
2. Technician receives & completes the job
3. System sends a notification (WhatsApp / Email)
4. Dashboard updates weekly KPI

## 📦 Module 1 — Admin Portal · Order Submission

**Goal:** Admin creates an order and assigns a technician

## 🧰 Module 2 — Technician Portal · Service Job

**Goal:** Technician views & completes assigned jobs

### Sample Data (JSON)

```json
{
  "orderId": "ORDER1234",
  "customerName": "Ahmad",
  "address": "No. 12, Jalan Sejuk, Shah Alam",
  "service": "Aircond cleaning",
  "assignedTechnician": "Ali",
  "status": "Pending"
}
```

**Mock technicians:** Ali, John, Bala, Yusoff

## 📣 Module 3 — Notification Trigger

**Goal:** Notify customer & manager when a job is marked "Job Done".

**Trigger:** status = Job Done

**Send via:**
- WhatsApp (preferred) — e.g. a deep-link URL with a pre-filled message
- Email (EmailJS is fine)

### Sample message

```
Hi {{Customer Name}}, job {{Order ID}} has been completed by Technician {{Name}} at {{Time}}. Please check and leave feedback. Thank you!
```

**Key skill:** back-end trigger logic + API / deep-link integration

## 📊 Bonus Module — KPI Dashboard (optional)

*[Note: This section appears to be empty in the original document]*

## 💬 Optional Self-Assessment (add to README)

- Which part was easiest? (UI / logic / upload / trigger …)
- Any parts you skipped or need help with?
- In a real project, which area are you most confident handling?

## 📬 Submission Guide

**Delivery:**
- Live demo (Netlify / Vercel / Firebase) or ZIP
- GitHub repo (preferred)

**README explaining:**
- What you built
- Tech used
- Challenges / assumptions / ideas

If you only did one module, explain your logic clearly — it helps us see your strengths.

## 🎨 Design & Branding

No logo needed. Keep the UI clean and easy to use. Treat this like a real-world project — show us what you'd ship!