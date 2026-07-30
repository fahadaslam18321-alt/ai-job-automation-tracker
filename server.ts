import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization helper for Gemini AI client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint: Parse Raw Job Posting Text
app.post('/api/extract-jd', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return res.status(400).json({ error: 'Job description text is required' });
    }

    const ai = getGeminiClient();
    const prompt = `Extract key structured information from this job posting:
---
${rawText}
---`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert HR data parser. Extract structured details from raw job posting text.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobTitle: { type: Type.STRING, description: 'Job Title or Role Name' },
            companyName: { type: Type.STRING, description: 'Company or Organization Name' },
            location: { type: Type.STRING, description: 'Location or Remote status' },
            salary: { type: Type.STRING, description: 'Salary range or Compensation if stated, otherwise empty string' },
            keySkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of key required technical skills, languages, tools, frameworks'
            },
            summary: { type: Type.STRING, description: 'Short 2-sentence summary of the job role' }
          },
          required: ['jobTitle', 'companyName', 'keySkills', 'summary']
        }
      }
    });

    const resultText = response.text?.trim() || '{}';
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/extract-jd:', err);
    res.status(500).json({ error: err.message || 'Failed to extract job description details' });
  }
});

// Endpoint: Tailor Resume Bullets, Cover Letter (<200 words), and Skill Analysis
const handleTailorRequest = async (req: express.Request, res: express.Response) => {
  try {
    const { resumeText, jobDescription, jobTitle, companyName } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Both resumeText and jobDescription are required' });
    }

    const ai = getGeminiClient();

    const prompt = `Analyze the candidate resume against the target job description and generate tailored assets.

Candidate Resume:
---
${resumeText}
---

Job Description (${jobTitle ? `Role: ${jobTitle}` : ''} ${companyName ? `Company: ${companyName}` : ''}):
---
${jobDescription}
---

INSTRUCTIONS:
1. Generate EXACTLY 3 strong, impactful, achievement-oriented resume bullet points tailored to match the key requirements and keywords of this job description. Start each with an action verb and include measurable impact where possible.
2. Draft a concise, highly compelling, professional cover letter MUST BE STRICTLY UNDER 200 WORDS. Highlight relevant experience, passion for the role, and direct match with the company's needs.
3. Perform a Skill Match Analysis comparing candidate technical skills with JD requirements. Return a match score percentage (0-100), list of matched skills, list of missing technical skills/keywords, and 3 actionable recommendations to improve the candidate's chances.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite career coach and executive resume strategist. Deliver highly effective, concise resume bullets, a cover letter under 200 words, and precise skill gap analysis in JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exactly 3 tailored, action-oriented resume bullet points'
            },
            coverLetter: {
              type: Type.STRING,
              description: 'Professional cover letter strictly under 200 words'
            },
            skillAnalysis: {
              type: Type.OBJECT,
              properties: {
                matchScore: { type: Type.INTEGER, description: 'Overall skill match score between 0 and 100' },
                matchedSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Technical skills and keywords found in both resume and JD'
                },
                missingSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Technical skills, frameworks, tools, or key phrases required by JD but missing/weak in resume'
                },
                keyRecommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Top 3 actionable recommendations to bridge gaps'
                }
              },
              required: ['matchScore', 'matchedSkills', 'missingSkills', 'keyRecommendations']
            }
          },
          required: ['bulletPoints', 'coverLetter', 'skillAnalysis']
        }
      }
    });

    const resultText = response.text?.trim() || '{}';
    const parsed = JSON.parse(resultText);

    // Calculate word count
    const words = parsed.coverLetter ? parsed.coverLetter.trim().split(/\s+/).filter(Boolean).length : 0;
    parsed.wordCount = words;

    res.json(parsed);
  } catch (err: any) {
    console.error('Error in tailor handler:', err);
    res.status(500).json({ error: err.message || 'Failed to generate tailored application assets' });
  }
};

app.post('/api/tailor', handleTailorRequest);
app.post('/api/tailor-resume', handleTailorRequest);

// Endpoint: Standalone Skill Match Analysis
app.post('/api/analyze-skills', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Both resumeText and jobDescription are required' });
    }

    const ai = getGeminiClient();
    const prompt = `Compare this resume with the job description and perform a deep skill & keyword match analysis.

Candidate Resume:
---
${resumeText}
---

Target Job Description:
---
${jobDescription}
---`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an ATS (Applicant Tracking System) keyword optimization expert. Identify matched skills, missing technical skills/keywords, and strategic optimization steps.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.INTEGER, description: 'Overall match score percentage 0 to 100' },
            matchedSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Technical skills present in both resume and JD'
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Important skills, libraries, frameworks, or domain terms required in JD but absent from resume'
            },
            keyRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific changes or keyword additions to boost ATS match'
            }
          },
          required: ['matchScore', 'matchedSkills', 'missingSkills', 'keyRecommendations']
        }
      }
    });

    const resultText = response.text?.trim() || '{}';
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/analyze-skills:', err);
    res.status(500).json({ error: err.message || 'Failed to run skill match analysis' });
  }
});

// Vite & Static File Handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
