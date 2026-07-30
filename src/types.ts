export type ApplicationStatus = 'Pending' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  location?: string;
  salary?: string;
  jobDescription: string;
  status: ApplicationStatus;
  appliedDate: string; // YYYY-MM-DD
  notes?: string;
  matchScore?: number;
  missingSkills?: string[];
  matchedSkills?: string[];
  tailoredBullets?: string[];
  coverLetter?: string;
  jobUrl?: string;
  updatedAt: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentRole: string;
  summary: string;
  resumeText: string;
  skills: string[];
}

export interface TailorRequest {
  resumeText: string;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
}

export interface SkillMatchAnalysis {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  keyRecommendations: string[];
}

export interface TailorResponse {
  bulletPoints: string[];
  coverLetter: string;
  wordCount: number;
  skillAnalysis: SkillMatchAnalysis;
}

export interface ExtractJdResponse {
  jobTitle: string;
  companyName: string;
  location: string;
  salary: string;
  keySkills: string[];
  summary: string;
}
