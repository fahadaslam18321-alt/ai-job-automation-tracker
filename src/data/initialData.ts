import { CandidateProfile, JobApplication } from '../types';

export const INITIAL_PROFILE: CandidateProfile = {
  id: 'cand-1',
  fullName: 'Alex Morgan',
  email: 'alex.morgan@techmail.dev',
  phone: '+1 (555) 382-9102',
  currentRole: 'Senior Full Stack Software Engineer',
  summary: 'Full Stack Software Engineer with 5+ years of experience building modern web applications, scalable REST APIs, microservices, and AI-driven workflow features with React, TypeScript, Node.js, and Cloud services.',
  skills: [
    'React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS',
    'PostgreSQL', 'REST APIs', 'GraphQL', 'Docker', 'AWS',
    'Git', 'Vite', 'Next.js', 'Jest', 'CI/CD'
  ],
  resumeText: `ALEX MORGAN
Senior Full Stack Engineer | San Francisco, CA | alex.morgan@techmail.dev

SUMMARY:
Results-driven Full Stack Software Engineer with 5+ years building high-throughput web applications and AI-integrated developer tools. Passionate about performant frontends, robust backend APIs, and developer experience.

WORK EXPERIENCE:
Senior Frontend Engineer | CloudMatrix Inc. | 2023 - Present
- Spearheaded redesign of core web application using React, TypeScript, and Tailwind CSS, improving core web vitals by 42%.
- Built real-time analytics dashboard servicing 150k daily active users with WebSockets and dynamic charts.
- Architected client-side caching layer using React Query, reducing API latency and network overhead by 35%.

Full Stack Developer | Nexa Tech | 2021 - 2023
- Developed microservices in Node.js and Express handling over 2M API requests per day.
- Authored automated CI/CD deployment pipelines using GitHub Actions, Docker, and AWS ECS.
- Partnered with product and design teams to deliver end-to-end features for SaaS subscription workflow.

TECHNICAL SKILLS:
- Frontend: React, TypeScript, Next.js, Redux Toolkit, Tailwind CSS, HTML5/CSS3
- Backend: Node.js, Express, Python, REST APIs, GraphQL, WebSockets
- Databases: PostgreSQL, MongoDB, Redis
- Infrastructure: Docker, AWS (S3, EC2, Lambda), GitHub Actions, CI/CD, Vite
- Testing & Tools: Jest, React Testing Library, Git, Postman
`
};

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobTitle: 'Senior Full Stack Engineer (AI Products)',
    companyName: 'Anthropic AI Studio',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$185,000 - $220,000',
    status: 'Interview',
    appliedDate: '2026-07-20',
    matchScore: 88,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Docker', 'Vite'],
    missingSkills: ['Gemini API SDK', 'Python FastAPI', 'Vector Databases (Chroma/Pinecone)'],
    jobDescription: `Anthropic AI Studio is seeking a Senior Full Stack Engineer to build intuitive, high-performance interfaces and APIs for our generative AI tools. You will work closely with research scientist and AI engineers to craft fluid UX for complex LLM workflows.

Requirements:
- 4+ years experience with React, TypeScript, and modern CSS frameworks (Tailwind CSS).
- Strong proficiency in Node.js / Express backend services and RESTful architecture.
- Experience with AI SDKs (Gemini/OpenAI), vector search, or Python/FastAPI is a major plus.
- Proven track record delivering responsive, high-throughput web applications.`,
    tailoredBullets: [
      'Architected end-to-end full stack web features with React 19, TypeScript, and Express, optimizing API payloads to reduce round-trip latency by 38%.',
      'Engineered server-side AI proxy workflows and streaming API interfaces for real-time model interaction with robust error boundaries.',
      'Designed scalable UI components styled with Tailwind CSS, delivering 100% WCAG accessibility compliance across 15+ high-traffic application pages.'
    ],
    coverLetter: `Dear Hiring Team at Anthropic AI Studio,

I am writing to express my enthusiasm for the Senior Full Stack Engineer role. With over five years of experience crafting high-performance React and Node.js applications, I specialize in translating complex technical capabilities into fluid, high-impact user experiences.

At CloudMatrix, I spearheaded the complete modernization of our user-facing analytics engine, reducing load times by 42% while scaling to support 150,000 daily active users. Additionally, my background building robust backend services with Express and TypeScript equips me to seamlessly bridge frontend user interfaces with AI orchestration layers.

Anthropic's vision for intuitive AI interfaces aligns perfectly with my passion for developer tooling and product excellence. I look forward to contributing my expertise in modern web systems to your team.

Best regards,
Alex Morgan`,
    notes: 'Recruiter phone screen passed on July 22. Technical interview scheduled for July 30th with Senior Staff Engineer.',
    updatedAt: '2026-07-22'
  },
  {
    id: 'app-2',
    jobTitle: 'Staff Frontend Developer',
    companyName: 'Vercel',
    location: 'Remote (US)',
    salary: '$190,000 - $230,000',
    status: 'Applied',
    appliedDate: '2026-07-24',
    matchScore: 92,
    matchedSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite', 'CI/CD'],
    missingSkills: ['Edge Functions', 'WebAssembly', 'Turbopack'],
    jobDescription: `Join Vercel's core frontend team to shape the future of web developer experience. We are building world-class platforms that power millions of developer workflows globally.

Key Responsibilities:
- Build blazing fast web interfaces using Next.js, React, and Tailwind CSS.
- Optimize frontend performance, bundling, and client-side caching.
- Collaborate with platform engineers to improve build speeds and developer ergonomics.`,
    tailoredBullets: [
      'Spearheaded frontend application architecture using React and Next.js, reducing total bundle size by 32% and achieving sub-100ms LCP scores.',
      'Implemented automated CI/CD testing pipelines and preview environments with GitHub Actions, accelerating release velocity by 2.5x.',
      'Standardized Tailwind CSS design tokens and reusable UI component libraries across 4 cross-functional development teams.'
    ],
    coverLetter: `Dear Vercel Hiring Team,

As a developer who relies on Vercel daily, I am thrilled to apply for the Staff Frontend Developer position. Over the past 5 years, I have focused extensively on building ultra-responsive React applications, optimizing web performance metrics, and establishing developer-centric component architectures.

In my recent role at CloudMatrix, I led our frontend optimization initiative, achieving a 42% boost in Core Web Vitals and lowering bounce rates across critical product conversion flows. My deep experience with React, TypeScript, and modern bundling tooling aligns directly with Vercel’s commitment to web speed and developer ergonomics.

I would welcome the opportunity to bring my frontend expertise and passion for high-craft user interfaces to Vercel.

Sincerely,
Alex Morgan`,
    notes: 'Submitted application through company portal with tailored cover letter.',
    updatedAt: '2026-07-24'
  },
  {
    id: 'app-3',
    jobTitle: 'Senior Full Stack Engineer - Payment Platform',
    companyName: 'Stripe',
    location: 'San Francisco, CA',
    salary: '$180,000 - $215,000',
    status: 'Pending',
    appliedDate: '2026-07-27',
    matchScore: 81,
    matchedSkills: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Docker', 'Testing'],
    missingSkills: ['Ruby on Rails', 'gRPC', 'Distributed Systems Isolation'],
    jobDescription: `Stripe is looking for a Senior Full Stack Engineer to join our Payment Infrastructure team. You will build secure, highly reliable payment API services and sleek dashboard interfaces used by businesses worldwide.

Requirements:
- 5+ years building backend systems in Node.js, Go, or Ruby, with strong SQL/PostgreSQL background.
- Experience building RESTful APIs, webhooks, and idempotent payment workflows.
- Solid frontend proficiency with React and modern JavaScript/TypeScript frameworks.`,
    notes: 'Need to tailor resume for backend payment reliability keywords before submitting.',
    updatedAt: '2026-07-27'
  },
  {
    id: 'app-4',
    jobTitle: 'Full Stack Engineer (Growth & Automation)',
    companyName: 'Linear App',
    location: 'Remote',
    salary: '$170,000 - $200,000',
    status: 'Offer',
    appliedDate: '2026-07-10',
    matchScore: 95,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'REST APIs', 'Git'],
    missingSkills: ['GraphQL Subscriptions', 'Electron'],
    jobDescription: `Linear is building the tool for modern software development. We are looking for a Full Stack Engineer to drive growth, referral mechanics, and user onboarding automation.

Requirements:
- Exceptional eye for UI polish, fluid animations, and craft.
- Strong full stack skillset across React, TypeScript, Node.js, and relational databases.
- Ownership mindset with passion for building smooth, instantaneous web interactions.`,
    tailoredBullets: [
      'Crafted pixel-perfect user interfaces with React, TypeScript, and custom CSS animations, resulting in a 28% increase in user onboarding completion.',
      'Engineered backend referral and automation microservices with Node.js and PostgreSQL, maintaining 99.99% uptime under high concurrency.',
      'Reduced interaction feedback loop times to under 16ms by optimizing client-side state transitions and optimistic UI updates.'
    ],
    coverLetter: `Dear Linear Team,

I am writing to express my strong interest in the Full Stack Engineer role. Linear represents the gold standard in software design and developer UX, and I would love to bring my passion for craft and speed to your team.

Throughout my career, I have prioritized fast, deterministic user interfaces and clean server architecture. At CloudMatrix, I created our real-time interactive dashboard, blending optimistic UI updates with resilient backend syncing to deliver a seamless experience for over 150k users.

I am eager to help shape the future of software management tools at Linear.

Warmly,
Alex Morgan`,
    notes: 'Received offer of $195k base + equity options! Offer deadline August 5th.',
    updatedAt: '2026-07-26'
  },
  {
    id: 'app-5',
    jobTitle: 'Senior Cloud Engineer',
    companyName: 'Datadog',
    location: 'New York, NY',
    salary: '$175,000 - $210,000',
    status: 'Rejected',
    appliedDate: '2026-07-02',
    matchScore: 64,
    matchedSkills: ['Docker', 'AWS', 'Node.js', 'CI/CD'],
    missingSkills: ['Kubernetes / K8s', 'Go (Golang)', 'Terraform', 'Prometheus'],
    jobDescription: `Datadog is seeking a Cloud Engineer to scale observability agent backend clusters. Requires extensive hands-on experience with Golang, Kubernetes, Terraform, and high-throughput telemetry pipelines.`,
    notes: 'Feedback indicated requirement for deep Golang and Kubernetes experience which was missing in my current resume profile.',
    updatedAt: '2026-07-12'
  }
];

export const PRESET_JOBS = [
  {
    title: 'Senior Full Stack Engineer (AI Products)',
    company: 'Anthropic AI Studio',
    description: `Anthropic AI Studio is seeking a Senior Full Stack Engineer to build intuitive, high-performance interfaces and APIs for our generative AI tools. You will work closely with research scientists and AI engineers to craft fluid UX for complex LLM workflows.

Requirements:
- 4+ years experience with React, TypeScript, and modern CSS frameworks (Tailwind CSS).
- Strong proficiency in Node.js / Express backend services and RESTful architecture.
- Experience with AI SDKs (Gemini/OpenAI), vector search, or Python/FastAPI is a major plus.
- Proven track record delivering responsive, high-throughput web applications.`
  },
  {
    title: 'Senior Frontend Developer',
    company: 'Stripe',
    description: `Stripe builds financial infrastructure for the internet. We are looking for a Senior Frontend Developer to create developer dashboards and dashboard customization features.

Requirements:
- Deep expertise in React, TypeScript, state management, and component architecture.
- Passion for accessibility (a11y), responsive design, and CSS token systems.
- Experience with unit/integration testing (Jest, React Testing Library, Cypress).
- Strong collaboration with UX designers and product leadership.`
  },
  {
    title: 'Full Stack Engineer (Growth)',
    company: 'Vercel',
    description: `Join Vercel to help scale our self-serve growth, billing workflows, and onboarding engine.

Requirements:
- 3+ years experience with Next.js, React, TypeScript, Node.js, and SQL/PostgreSQL.
- Familiarity with billing integrations (Stripe API), analytics pipelines, and A/B testing.
- Strong focus on page performance, Core Web Vitals, and SEO.`
  }
];
