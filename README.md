# 🚀 AI Job Automation & Tracker

[![Live Demo](https://img.shields.io/badge/Live_Demo-AI_Studio-blueviolet?style=for-the-badge&logo=google)](https://ai-job-automation-tracker.ai.studio)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.0-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

**AI Job Automation & Tracker** is an all-in-one smart job hunting assistant designed to streamline your career journey. Powered by **Google Gemini 2.0 AI**, this application helps job seekers analyze job descriptions, tailor resumes and cover letters in real-time, compute ATS compatibility scores, track job application pipelines, and gain detailed analytics on job application success.

🌐 **Live Application:** [https://ai-job-automation-tracker.ai.studio](https://ai-job-automation-tracker.ai.studio)

---

## ✨ Key Features

### 📄 1. AI Resume & Cover Letter Tailorer
- **Targeted Customization:** Automatically adapts your resume bullet points and summary to match the job description.
- **Dynamic Cover Letter Generator:** Generates compelling, highly contextualized cover letters tailored to specific hiring managers and company cultures.
- **ATS Optimization:** Analyzes target job keywords and seamlessly integrates missing hard and soft skills.

### 🎯 2. Skill Match & ATS Compatibility Analyzer
- **Real-Time Match Score:** Instant evaluation of how well your profile aligns with target roles.
- **Skill Gap Identification:** Highlights missing technical skills, qualifications, and certifications.
- **Actionable Recommendations:** Suggests exact keyword additions and phrasing improvements to pass Applicant Tracking Systems (ATS).

### 📊 3. Application Pipeline Tracker
- **Kanban & List Views:** Organize applications across pipeline stages (*Bookmarked*, *Applied*, *Interviewing*, *Offered*, *Rejected*).
- **Application Details:** Store company names, job titles, salary ranges, contact details, notes, and direct job post links.
- **Deadline & Follow-up Reminders:** Keep track of upcoming interview dates and pending response windows.

### 📈 4. Interactive Analytics Dashboard
- **Visual Insights:** Powered by **Recharts** to plot application response rates, weekly submission trends, and funnel conversions.
- **Data-Driven Strategy:** Identify which resume variations yield the highest interview conversion rates.

### 📥 5. One-Click Document Export
- **PDF Export:** Seamless export of generated tailored resumes and cover letters using `jsPDF` and `html2canvas`.
- **Clean Formatting:** Maintains modern, recruiter-friendly layouts ready for immediate submission.

---

## 🛠️ Tech Stack & Architecture

### **Frontend Framework & Styling**
- **React 19:** Modern component architectures with hooks and reactive state management.
- **Vite 6:** Ultra-fast HMR and build bundling.
- **TypeScript 5.8:** End-to-end type safety and maintainable codebase.
- **Tailwind CSS v4 (`@tailwindcss/vite`):** Next-gen utility-first styling.
- **Motion (Framer Motion):** Smooth micro-interactions and animated UI transitions.
- **Lucide React:** Clean icon set.

### **AI Engine & API**
- **Google Gen AI SDK (`@google/genai`):** Gemini 2.0 API integration for deep language parsing, resume evaluation, and text generation.
- **Express.js:** Server side proxy and API request orchestrator.

### **Data & Utilities**
- **Recharts:** Responsive data charts and analytics visualizations.
- **jsPDF & html2canvas:** Client-side document canvas conversion to downloadable PDF files.

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
