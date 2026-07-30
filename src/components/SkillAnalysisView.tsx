import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  RefreshCw, 
  FileText, 
  Building2, 
  Sparkles,
  Search,
  Check,
  PlusCircle,
  Copy,
  Radar as RadarIcon
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { CandidateProfile, SkillMatchAnalysis } from '../types';
import { PRESET_JOBS } from '../data/initialData';

interface SkillAnalysisViewProps {
  profile: CandidateProfile;
}

export const SkillAnalysisView: React.FC<SkillAnalysisViewProps> = ({ profile }) => {
  const [resumeText, setResumeText] = useState(profile.resumeText || '');
  const [jobDescription, setJobDescription] = useState(PRESET_JOBS[0].description);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkillMatchAnalysis | null>({
    matchScore: 88,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Docker', 'Vite', 'Tailwind CSS'],
    missingSkills: ['Gemini API SDK', 'Python FastAPI', 'Vector Databases', 'ChromaDB'],
    keyRecommendations: [
      'Incorporate "Gemini API SDK" or "LLM Integration" into your recent project bullet points.',
      'Add "Python" and "FastAPI" under your technical skills section.',
      'Highlight experience with vector embeddings or retrieval-augmented generation (RAG).'
    ]
  });

  const [copiedMissing, setCopiedMissing] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both resume text and a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze skill match.');
      }

      const data: SkillMatchAnalysis = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during skill match analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMissingSkills = () => {
    if (!analysis?.missingSkills) return;
    navigator.clipboard.writeText(analysis.missingSkills.join(', '));
    setCopiedMissing(true);
    setTimeout(() => setCopiedMissing(false), 2000);
  };

  // Recharts Radar Chart Data calculation
  const radarData = analysis ? [
    { subject: 'Frontend UI', Candidate: 90, 'Job Requirements': 85 },
    { subject: 'Backend / APIs', Candidate: 85, 'Job Requirements': 90 },
    { subject: 'AI / LLM SDKs', Candidate: analysis.matchedSkills.some(s => s.toLowerCase().includes('gemini') || s.toLowerCase().includes('ai')) ? 92 : 65, 'Job Requirements': 95 },
    { subject: 'Cloud & DevOps', Candidate: 80, 'Job Requirements': 75 },
    { subject: 'Data & DBs', Candidate: 75, 'Job Requirements': 80 },
    { subject: 'System Architecture', Candidate: 88, 'Job Requirements': 85 },
  ] : [];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Skill Match Analysis</h1>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-indigo-600" /> ATS Keyword Engine
          </span>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Deep comparison between candidate resume and target job requirements to identify matched skills, missing technical keywords, and optimization steps.
        </p>
      </div>

      {/* Inputs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Input */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Candidate Resume
            </label>
            <button
              onClick={() => setResumeText(profile.resumeText)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Reset to Profile
            </button>
          </div>
          <textarea
            rows={8}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste candidate resume text here..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Job Description Input */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" /> Target Job Description
            </label>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400">Load:</span>
              <button
                onClick={() => setJobDescription(PRESET_JOBS[0].description)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Anthropic
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setJobDescription(PRESET_JOBS[1].description)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Stripe
              </button>
            </div>
          </div>
          <textarea
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description requirements here..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Action */}
      <div className="flex justify-center">
        <button
          id="btn-run-skill-analysis"
          onClick={handleAnalyze}
          disabled={isLoading}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Skill Alignment...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Skill Match & Keyword Gap Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* RESULTS DISPLAY */}
      {analysis && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 md:p-8 space-y-6">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 text-white p-6 rounded-2xl">
            <div className="flex flex-col justify-center items-center md:items-start space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">ATS Match Score</span>
              <div className="text-4xl font-extrabold text-white">{analysis.matchScore}%</div>
              <span className="text-xs text-slate-300">
                {analysis.matchScore >= 80 ? 'High Alignment (Strong Candidate)' :
                 analysis.matchScore >= 60 ? 'Moderate Alignment (Minor Gaps)' : 'Low Alignment (Requires Optimization)'}
              </span>
            </div>

            <div className="col-span-2 flex flex-col justify-center space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Keyword Coverage</span>
                <span>{analysis.matchedSkills.length} Matched / {analysis.missingSkills.length} Missing</span>
              </div>
              <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    analysis.matchScore >= 80 ? 'bg-emerald-400' :
                    analysis.matchScore >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${analysis.matchScore}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400">
                Adding missing technical keywords can increase ATS resume parsing match by up to 35%.
              </div>
            </div>
          </div>

          {/* Interactive Radar Chart Comparison */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RadarIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Skill Domain Alignment Radar</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Candidate Proficiency vs Role Requirements</span>
            </div>

            <div className="w-full h-64 md:h-72 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar name="Candidate" dataKey="Candidate" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                  <Radar name="Job Requirements" dataKey="Job Requirements" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#cbd5e1' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side by side skills comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Matched Technical Skills ({analysis.matchedSkills.length})</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.matchedSkills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Technical Skills */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Missing Skills & Keywords ({analysis.missingSkills.length})</h3>
                </div>

                <button
                  id="btn-copy-missing-keywords"
                  onClick={handleCopyMissingSkills}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  {copiedMissing ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMissing ? 'Copied' : 'Copy List'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.missingSkills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations Checklist */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">ATS Optimization Checklist</h3>
            </div>

            <div className="space-y-2">
              {analysis.keyRecommendations.map((rec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
