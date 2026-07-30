import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Copy, 
  Check, 
  Edit3, 
  ListOrdered, 
  FileText, 
  Target, 
  AlertCircle,
  CheckCircle2,
  Download,
  RefreshCw
} from 'lucide-react';
import { JobApplication, CandidateProfile } from '../types';
import { generateAtsResumePdf } from '../utils/exportPdf';

interface JobDetailsModalProps {
  app: JobApplication | null;
  profile?: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onTailorAgain: (app: JobApplication) => void;
  onEdit: (app: JobApplication) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  app,
  profile,
  isOpen,
  onClose,
  onTailorAgain,
  onEdit
}) => {
  const [copiedBullets, setCopiedBullets] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!isOpen || !app) return null;

  const handleExportPdf = async () => {
    if (!app || !profile) return;
    setIsExportingPdf(true);
    try {
      await generateAtsResumePdf({
        profile,
        jobTitle: app.jobTitle,
        companyName: app.companyName,
        tailoredBullets: app.tailoredBullets,
        coverLetter: app.coverLetter
      });
    } catch (err) {
      console.error('PDF Export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyBullets = () => {
    if (!app.tailoredBullets) return;
    navigator.clipboard.writeText(app.tailoredBullets.map(b => `• ${b}`).join('\n\n'));
    setCopiedBullets(true);
    setTimeout(() => setCopiedBullets(false), 2000);
  };

  const handleCopyCover = () => {
    if (!app.coverLetter) return;
    navigator.clipboard.writeText(app.coverLetter);
    setCopiedCover(true);
    setTimeout(() => setCopiedCover(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {app.status}
            </span>
            <h2 className="text-xl font-bold">{app.jobTitle}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium pt-1">
              <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {app.companyName}</span>
              {app.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {app.location}</span>}
              {app.salary && <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {app.salary}</span>}
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {app.appliedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(app);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Edit Application"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Action Header */}
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-950">AI Tailoring Assets Status</div>
                <div className="text-[11px] text-indigo-700">
                  {app.tailoredBullets || app.coverLetter ? 'Customized bullets and cover letter generated' : 'Not yet tailored for this job'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {app.tailoredBullets && profile && (
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isExportingPdf ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>Export PDF</span>
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  onTailorAgain(app);
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{app.tailoredBullets ? 'Re-Tailor with AI' : 'Generate Tailored Assets'}</span>
              </button>
            </div>
          </div>

          {/* Tailored Bullets */}
          {app.tailoredBullets && app.tailoredBullets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-indigo-600" />
                  3 Tailored Resume Bullets
                </h3>
                <button
                  onClick={handleCopyBullets}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  {copiedBullets ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBullets ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {app.tailoredBullets.map((bullet, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                    • {bullet}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cover Letter */}
          {app.coverLetter && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Short Cover Letter
                </h3>
                <button
                  onClick={handleCopyCover}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  {copiedCover ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCover ? 'Copied' : 'Copy Cover Letter'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {app.coverLetter}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {app.missingSkills && app.missingSkills.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Missing Technical Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {app.missingSkills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    +{skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Full Job Description</h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {app.jobDescription}
            </div>
          </div>

          {/* Notes */}
          {app.notes && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Application Notes</h3>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                {app.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
