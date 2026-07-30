# 🚀 AI Job Automation & Tracker

[![Live Demo](https://img.shields.io/badge/Live_Demo-AI_Studio-blueviolet?style=for-the-badge&logo=google)](https://ai-job-automation-tracker.ai.studio)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.0-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

> **AI Job Automation & Tracker** is an AI-powered career assistant that automates every stage of the modern job search. Built with **React, TypeScript, Tailwind CSS, Vite, Express.js, and Google Gemini 2.0**, the platform intelligently tailors resumes and cover letters, evaluates ATS compatibility, tracks job applications, and provides insightful analytics to maximize interview success.

🌐 **Live Demo:** https://ai-job-automation-tracker.ai.studio

---

# ✨ Features

## 🤖 AI Resume & Cover Letter Tailoring
- Tailors resumes according to any job description.
- Generates personalized AI-powered cover letters.
- Optimizes resumes for Applicant Tracking Systems (ATS).
- Suggests missing keywords, technical skills, and soft skills.
- Improves resume summaries and bullet points automatically.

---

## 🎯 ATS Match & Skill Gap Analysis
- Calculates real-time ATS compatibility scores.
- Detects missing technologies and qualifications.
- Provides keyword optimization recommendations.
- Highlights strengths and weaknesses against target roles.

---

## 📋 Job Application Tracker
- Organize applications using **Kanban** and **List** views.
- Manage application stages:
  - 📌 Bookmarked
  - 📄 Applied
  - 💬 Interview
  - 🎉 Offered
  - ❌ Rejected
- Store:
  - Company
  - Job Title
  - Salary
  - Recruiter Contact
  - Notes
  - Job URL
- Track interview dates and follow-up reminders.

---

## 📊 Analytics Dashboard
- Visualize application performance using interactive charts.
- Monitor:
  - Application success rate
  - Weekly submissions
  - Interview conversion
  - Offer ratio
- Make data-driven improvements to your job search strategy.

---

## 📄 PDF Export
- Export resumes and cover letters instantly.
- Clean recruiter-friendly formatting.
- Powered by **jsPDF** and **html2canvas**.

---

# 🛠️ Tech Stack

## Frontend
- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS v4
- Framer Motion
- Lucide React

## Backend
- Express.js

## AI Integration
- Google Gemini 2.0
- @google/genai SDK

## Data Visualization
- Recharts

## PDF Generation
- jsPDF
- html2canvas

---
## 📁 Repository Structure

```text
├── assets/                  # App icon/media assets
├── dist/ / build/           # Compiled static output
├── node_modules/            # Dependencies
├── .env.example             # Example environment variable template
├── .gitignore               # Git ignored patterns
├── bun.lock                 # Lockfile for Bun runtime/package manager
├── metadata.json            # AI Studio applet configuration metadata
├── package.json             # Node dependencies and scripts
├── tsconfig.json            # TypeScript engine rules
├── vite.config.ts           # Vite build pipeline setup
└── README.md                # Project documentation

├── tsconfig.json
├── vite.config.ts
└── README.md
