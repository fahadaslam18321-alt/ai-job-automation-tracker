import React, { useState, useEffect } from 'react';
import { X, Sparkles, Building2, MapPin, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Partial<JobApplication>) => void;
  editingApp?: JobApplication | null;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingApp
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Pending');
  const [jobDescription, setJobDescription] = useState('');
  const [notes, setNotes] = useState('');

  const [rawJdPaste, setRawJdPaste] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  useEffect(() => {
    if (editingApp) {
      setJobTitle(editingApp.jobTitle || '');
      setCompanyName(editingApp.companyName || '');
      setLocation(editingApp.location || '');
      setSalary(editingApp.salary || '');
      setStatus(editingApp.status || 'Pending');
      setJobDescription(editingApp.jobDescription || '');
      setNotes(editingApp.notes || '');
    } else {
      setJobTitle('');
      setCompanyName('');
      setLocation('');
      setSalary('');
      setStatus('Pending');
      setJobDescription('');
      setNotes('');
      setRawJdPaste('');
    }
    setExtractError(null);
  }, [editingApp, isOpen]);

  if (!isOpen) return null;

  const handleAutoExtract = async () => {
    if (!rawJdPaste.trim()) {
      setExtractError('Please paste raw job description text to auto-fill.');
      return;
    }

    setIsExtracting(true);
    setExtractError(null);

    try {
      const response = await fetch('/api/extract-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: rawJdPaste })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to extract job posting details');
      }

      const data = await response.json();
      if (data.jobTitle) setJobTitle(data.jobTitle);
      if (data.companyName) setCompanyName(data.companyName);
      if (data.location) setLocation(data.location);
      if (data.salary) setSalary(data.salary);
      if (data.summary) setJobDescription(data.summary + '\n\n' + rawJdPaste);
      else setJobDescription(rawJdPaste);

      setRawJdPaste('');
    } catch (err: any) {
      console.error(err);
      setExtractError(err.message || 'Auto-extract failed.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !companyName.trim()) return;

    onSave({
      id: editingApp?.id,
      jobTitle: jobTitle.trim(),
      companyName: companyName.trim(),
      location: location.trim(),
      salary: salary.trim(),
      status,
      jobDescription: jobDescription.trim(),
      notes: notes.trim(),
      appliedDate: editingApp?.appliedDate || new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold">{editingApp ? 'Edit Job Application' : 'Add New Job Application'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingApp ? 'Update status and job parameters' : 'Enter details or use AI Auto-Fill from raw posting text'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Modal Body */}
          <div className="p-6 space-y-5 overflow-y-auto max-h-[85vh] flex-1">
            {/* AI Auto-Fill Tool (Only for new applications) */}
            {!editingApp && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Auto-Fill from Raw Job Posting</span>
                </div>
                <p className="text-[11px] text-indigo-700">Paste unformatted job posting text below to auto-extract role title, company, location, and salary.</p>

                <div className="space-y-2 pt-1">
                  <textarea
                    rows={3}
                    value={rawJdPaste}
                    onChange={(e) => setRawJdPaste(e.target.value)}
                    placeholder="Paste unformatted job listing text here..."
                    className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />

                  {extractError && (
                    <div className="text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{extractError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAutoExtract}
                    disabled={isExtracting || !rawJdPaste.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Extract Details with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe / Anthropic"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA (Hybrid / Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Salary Range</label>
                <input
                  type="text"
                  placeholder="e.g. $180k - $210k"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Application Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Pending">Pending (Not yet submitted)</option>
                <option value="Applied">Applied (Submitted)</option>
                <option value="Interview">Interview (Active Loop)</option>
                <option value="Offer">Offer Received</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Job Description / Requirements</label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste responsibilities and tech stack requirements..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Notes & Interview Timeline</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Recruiter phone screen passed, technical loop scheduled..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Modal Fixed Footer */}
          <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              {editingApp ? 'Update Job Application' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
