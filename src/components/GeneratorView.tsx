import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  FileText, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  ListOrdered, 
  Plus, 
  Save, 
  Building2, 
  Zap, 
  ArrowRight,
  Info,
  Layers,
  Sliders,
  Download
} from 'lucide-react';
import { CandidateProfile, JobApplication, TailorResponse } from '../types';
import { PRESET_JOBS } from '../data/initialData';
import Prism from './Prism';
import { generateAtsResumePdf } from '../utils/exportPdf';

interface GeneratorViewProps {
  profile: CandidateProfile;
  applications: JobApplication[];
  selectedAppForTailor?: JobApplication | null;
  onSaveToDashboard: (appData: Partial<JobApplication>, tailoredAssets: TailorResponse) => void;
  onClearSelectedApp?: () => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  profile,
  applications,
  selectedAppForTailor,
  onSaveToDashboard,
  onClearSelectedApp
}) => {
  const [resumeText, setResumeText] = useState(profile.resumeText || '');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TailorResponse | null>(null);

  const [copiedBullets, setCopiedBullets] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'bullets' | 'cover' | 'skills'>('bullets');

  // Interactive Prism Controls State
  const [prismAnimType, setPrismAnimType] = useState<'rotate' | 'hover' | '3drotate'>('rotate');
  const [prismHue, setPrismHue] = useState<number>(0);
  const [prismGlow, setPrismGlow] = useState<number>(1);
  const [prismTimeScale, setPrismTimeScale] = useState<number>(0.5);
  const [showPrismControls, setShowPrismControls] = useState<boolean>(false);

  // PDF Export State
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPdf = async () => {
    if (!results) return;
    setIsExportingPdf(true);
    try {
      await generateAtsResumePdf({
        profile,
        jobTitle: jobTitle || 'Tailored Position',
        companyName,
        tailoredBullets: results.bullets,
        coverLetter: results.coverLetter
      });
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // If a job was passed from Dashboard "Tailor with AI"
  useEffect(() => {
    if (selectedAppForTailor) {
      setJobTitle(selectedAppForTailor.jobTitle);
      setCompanyName(selectedAppForTailor.companyName);
      setJobDescription(selectedAppForTailor.jobDescription);
      if (selectedAppForTailor.tailoredBullets || selectedAppForTailor.coverLetter) {
        setResults({
          bulletPoints: selectedAppForTailor.tailoredBullets || [],
          coverLetter: selectedAppForTailor.coverLetter || '',
          wordCount: selectedAppForTailor.coverLetter ? selectedAppForTailor.coverLetter.trim().split(/\s+/).filter(Boolean).length : 0,
          skillAnalysis: {
            matchScore: selectedAppForTailor.matchScore || 85,
            matchedSkills: selectedAppForTailor.matchedSkills || [],
            missingSkills: selectedAppForTailor.missingSkills || [],
            keyRecommendations: ['Incorporate missing keywords in top summary', 'Quantify team impact metrics in past projects']
          }
        });
      }
    }
  }, [selectedAppForTailor]);

  // Load preset job
  const handleLoadPreset = (preset: typeof PRESET_JOBS[0]) => {
    setJobTitle(preset.title);
    setCompanyName(preset.company);
    setJobDescription(preset.description);
    setResults(null);
  };

  // Generate AI tailored assets
  const handleGenerate = async () => {
    if (!resumeText.trim()) {
      setError('Please provide candidate resume text.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          jobTitle,
          companyName
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate tailored application assets.');
      }

      const data: TailorResponse = await response.json();
      setResults(data);
      setActiveTab('bullets');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating assets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBullets = () => {
    if (!results?.bulletPoints) return;
    const textToCopy = results.bulletPoints.map(b => `• ${b}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedBullets(true);
    setTimeout(() => setCopiedBullets(false), 2000);
  };

  const handleCopyCoverLetter = () => {
    if (!results?.coverLetter) return;
    navigator.clipboard.writeText(results.coverLetter);
    setCopiedCover(true);
    setTimeout(() => setCopiedCover(false), 2000);
  };

  const handleSave = () => {
    if (!results) return;
    onSaveToDashboard(
      {
        id: selectedAppForTailor?.id,
        jobTitle: jobTitle || 'Tailored Application',
        companyName: companyName || 'Target Company',
        jobDescription: jobDescription,
      },
      results
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Resume & Cover Letter Tailoring
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Powered by Gemini
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Input your resume and a target job description to generate 3 tailored impact bullet points, a &lt;200 word cover letter, and skill gap analysis.
          </p>
        </div>

        {selectedAppForTailor && (
          <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="text-indigo-900 font-medium">
              Tailoring for: <strong className="font-bold">{selectedAppForTailor.jobTitle}</strong> at {selectedAppForTailor.companyName}
            </div>
            {onClearSelectedApp && (
              <button 
                onClick={onClearSelectedApp}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* React Bits: Prism 3D Interactive WebGL Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl">
        <div className="w-full h-44 md:h-52 relative">
          <Prism
            animationType={prismAnimType}
            timeScale={prismTimeScale}
            height={3.5}
            baseWidth={5.5}
            scale={3.2}
            hueShift={prismHue}
            colorFrequency={1}
            noise={0.3}
            glow={prismGlow}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent p-6 flex flex-col justify-between pointer-events-none">
            <div className="flex items-start justify-between">
              <div className="space-y-1 max-w-lg">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  React Bits • WebGL Prism Shader
                </span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                  Multidimensional AI Refractor
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Refracting candidate experience into targeted bullet points and cover letters with real-time 3D ray marching.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPrismControls(!showPrismControls)}
                className="pointer-events-auto px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showPrismControls ? 'Hide Prism Controls' : 'Customize Prism Shader'}</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-300 font-mono">
              <span>Animation: <strong className="text-cyan-300">{prismAnimType}</strong></span>
              <span>Hue Shift: <strong className="text-indigo-300">{(prismHue * (180 / Math.PI)).toFixed(0)}°</strong></span>
              <span>Glow: <strong className="text-emerald-300">{prismGlow}x</strong></span>
            </div>
          </div>
        </div>

        {/* Interactive Prism Controls Panel */}
        {showPrismControls && (
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Animation Mode</label>
              <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
                {(['rotate', 'hover', '3drotate'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPrismAnimType(mode)}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                      prismAnimType === mode
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>Hue Shift</span>
                <span className="text-indigo-300">{(prismHue * (180 / Math.PI)).toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.PI * 2}
                step={0.1}
                value={prismHue}
                onChange={(e) => setPrismHue(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>Glow Intensity</span>
                <span className="text-emerald-300">{prismGlow}</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={3.0}
                step={0.1}
                value={prismGlow}
                onChange={(e) => setPrismGlow(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>Time Scale</span>
                <span className="text-cyan-300">{prismTimeScale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={2.0}
                step={0.1}
                value={prismTimeScale}
                onChange={(e) => setPrismTimeScale(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Candidate Resume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">1. Candidate Resume</h3>
                <p className="text-[11px] text-slate-400">Your background experience and technical skills</p>
              </div>
            </div>

            <button
              id="btn-reset-resume"
              onClick={() => setResumeText(profile.resumeText)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset to Saved Profile
            </button>
          </div>

          <textarea
            id="input-resume-text"
            rows={10}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your candidate resume text or work experience bullet points here..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>{resumeText.length} characters</span>
            <span>Tip: Ensure skills and past bullet metrics are included.</span>
          </div>
        </div>

        {/* Panel 2: Job Description */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">2. Target Job Posting</h3>
                <p className="text-[11px] text-slate-400">Job description, title, and key requirements</p>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Sample JDs:</span>
            {PRESET_JOBS.map((preset, idx) => (
              <button
                key={idx}
                id={`btn-preset-jd-${idx}`}
                onClick={() => handleLoadPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors shrink-0"
              >
                {preset.company}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              id="input-job-title"
              type="text"
              placeholder="Job Title (e.g. Senior Frontend Engineer)"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400"
            />
            <input
              id="input-company-name"
              type="text"
              placeholder="Company Name (e.g. Anthropic)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <textarea
            id="input-job-description"
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description text here (requirements, key responsibilities, tech stack)..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>{jobDescription.length} characters</span>
            <span>Include key responsibilities & required stack</span>
          </div>
        </div>
      </div>

      {/* Error Banner if any */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="flex justify-center pt-2">
        <button
          id="btn-generate-ai-assets"
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2.5"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing JD & Tailoring Assets...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate 3 Bullets, Cover Letter & Skill Match</span>
            </>
          )}
        </button>
      </div>

      {/* RESULTS DISPLAY SECTION */}
      {results && (
        <div id="tailored-results-section" className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8 space-y-6">
          {/* Header & Save Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Tailored Output</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Ready to Apply
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Generated specifically for {jobTitle || 'Target Role'} {companyName ? `at ${companyName}` : ''}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-export-resume-pdf"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {isExportingPdf ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Rendering PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Export Tailored Resume (PDF)</span>
                  </>
                )}
              </button>

              <button
                id="btn-save-to-dashboard"
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved to Dashboard!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save to Job Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              id="tab-result-bullets"
              onClick={() => setActiveTab('bullets')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'bullets'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>3 Tailored Bullets</span>
            </button>

            <button
              id="tab-result-cover"
              onClick={() => setActiveTab('cover')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'cover'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Cover Letter (&lt;200 Words)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {results.wordCount} words
              </span>
            </button>

            <button
              id="tab-result-skills"
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'skills'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Skill Match Analysis ({results.skillAnalysis.matchScore}%)</span>
            </button>
          </div>

          {/* TAB 1: 3 TAILORED RESUME BULLETS */}
          {activeTab === 'bullets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">3 Strong Tailored Resume Bullet Points</h3>
                  <p className="text-xs text-slate-500">Action-oriented statements highlighting JD keywords and impact metrics.</p>
                </div>
                <button
                  id="btn-copy-all-bullets"
                  onClick={handleCopyBullets}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  {copiedBullets ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBullets ? 'Copied All!' : 'Copy All 3 Bullets'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {results.bulletPoints.map((bullet, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 hover:border-indigo-300 transition-colors group"
                  >
                    <div className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 text-xs text-slate-800 leading-relaxed font-sans">
                      {bullet}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(bullet);
                      }}
                      title="Copy this bullet"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: COVER LETTER */}
          {activeTab === 'cover' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Short Professional Cover Letter</h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {results.wordCount} Words (Strictly &lt;200 Words)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Concise, impactful intro tailored for recruiters and hiring managers.</p>
                </div>

                <button
                  id="btn-copy-cover-letter"
                  onClick={handleCopyCoverLetter}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  {copiedCover ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCover ? 'Copied Letter!' : 'Copy Cover Letter'}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <textarea
                  id="output-cover-letter"
                  rows={8}
                  value={results.coverLetter}
                  onChange={(e) => {
                    const newText = e.target.value;
                    const words = newText.trim().split(/\s+/).filter(Boolean).length;
                    setResults({ ...results, coverLetter: newText, wordCount: words });
                  }}
                  className="w-full bg-transparent border-0 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none focus:ring-0 resize-y"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SKILL MATCH ANALYSIS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="text-center md:text-left space-y-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Overall Match Score</div>
                  <div className="text-3xl font-extrabold text-slate-900">{results.skillAnalysis.matchScore}%</div>
                  <div className="text-[11px] text-slate-400">Based on candidate profile vs JD requirements</div>
                </div>

                <div className="col-span-2 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Qualification Alignment</span>
                    <span className="text-indigo-600">{results.skillAnalysis.matchScore}% Match</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        results.skillAnalysis.matchScore >= 80 ? 'bg-emerald-500' :
                        results.skillAnalysis.matchScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${results.skillAnalysis.matchScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Matched Skills */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Matched Skills ({results.skillAnalysis.matchedSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {results.skillAnalysis.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Missing Skills & Keywords ({results.skillAnalysis.missingSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {results.skillAnalysis.missingSkills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Key Optimization Recommendations</span>
                </div>
                <ul className="space-y-1.5 pt-1">
                  {results.skillAnalysis.keyRecommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-indigo-950 flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
