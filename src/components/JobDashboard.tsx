import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Calendar, 
  Building2, 
  MapPin, 
  DollarSign, 
  FileText, 
  MoreVertical, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageSquare, 
  Trophy, 
  Filter, 
  ChevronDown, 
  Eye, 
  Trash2, 
  Edit3,
  LayoutGrid,
  List,
  Target
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types';

interface JobDashboardProps {
  applications: JobApplication[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDeleteApplication: (id: string) => void;
  onOpenAddModal: () => void;
  onSelectForTailor: (app: JobApplication) => void;
  onViewDetails: (app: JobApplication) => void;
  onEditApplication: (app: JobApplication) => void;
}

export const JobDashboard: React.FC<JobDashboardProps> = ({
  applications,
  onUpdateStatus,
  onDeleteApplication,
  onOpenAddModal,
  onSelectForTailor,
  onViewDetails,
  onEditApplication
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const statuses: { label: string; value: string; color: string; count: number }[] = [
    { label: 'All Jobs', value: 'All', color: 'bg-slate-100 text-slate-800', count: applications.length },
    { label: 'Pending', value: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', count: applications.filter(a => a.status === 'Pending').length },
    { label: 'Applied', value: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200', count: applications.filter(a => a.status === 'Applied').length },
    { label: 'Interview', value: 'Interview', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', count: applications.filter(a => a.status === 'Interview').length },
    { label: 'Offer', value: 'Offer', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', count: applications.filter(a => a.status === 'Offer').length },
    { label: 'Rejected', value: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200', count: applications.filter(a => a.status === 'Rejected').length }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.jobDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'Applied':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"><FileText className="w-3.5 h-3.5" /> Applied</span>;
      case 'Interview':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><MessageSquare className="w-3.5 h-3.5" /> Interview</span>;
      case 'Offer':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><Trophy className="w-3.5 h-3.5" /> Offer</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Application Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Manage target jobs, track pipeline statuses, and trigger AI resume tailoring.</p>
        </div>

        <button
          id="btn-add-application"
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Job Application</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Tracked</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</div>
          <div className="text-xs text-slate-400 mt-1">Across all status stages</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Applied</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            {applications.filter(a => a.status === 'Applied').length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Awaiting employer response</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Interviews</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {applications.filter(a => a.status === 'Interview').length}
          </div>
          <div className="text-xs text-indigo-600 font-medium mt-1">Active interview loop</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Offers</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {applications.filter(a => a.status === 'Offer').length}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Offers received</div>
        </div>
      </div>

      {/* Controls Bar: Search, Status Filters, View Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-search-jobs"
              type="text"
              placeholder="Search title, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter:</span>
          {statuses.map(st => (
            <button
              key={st.value}
              id={`filter-status-${st.value.toLowerCase()}`}
              onClick={() => setSelectedStatus(st.value)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                selectedStatus === st.value
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{st.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedStatus === st.value ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {st.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Jobs Display */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Job Applications Found</h3>
          <p className="text-slate-500 text-xs mt-1">
            {searchQuery || selectedStatus !== 'All' 
              ? 'Try adjusting your search terms or status filters.' 
              : 'Add your first job application to start tracking and tailoring resumes with AI.'}
          </p>
          <button
            id="btn-empty-add-job"
            onClick={onOpenAddModal}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Application
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApplications.map(app => (
            <div
              key={app.id}
              id={`job-card-${app.id}`}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3.5">
                {/* Header: Title, Status, Menu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-base leading-snug truncate group-hover:text-indigo-600 transition-colors">
                      {app.jobTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{app.companyName}</span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="relative shrink-0">
                    <button
                      id={`btn-status-dropdown-${app.id}`}
                      onClick={() => setActiveMenuId(activeMenuId === app.id ? null : app.id)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {getStatusBadge(app.status)}
                    </button>

                    {activeMenuId === app.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 space-y-0.5">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Update Status</div>
                        {(['Pending', 'Applied', 'Interview', 'Offer', 'Rejected'] as ApplicationStatus[]).map(st => (
                          <button
                            key={st}
                            onClick={() => {
                              onUpdateStatus(app.id, st);
                              setActiveMenuId(null);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                              app.status === st ? 'text-indigo-600 bg-indigo-50/50 font-semibold' : 'text-slate-700'
                            }`}
                          >
                            <span>{st}</span>
                            {app.status === st && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub details: Location, Salary, Date, Match Score */}
                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500 pt-1">
                  {app.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{app.location}</span>
                    </div>
                  )}
                  {app.salary && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-400" />
                      <span>{app.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Applied {app.appliedDate}</span>
                  </div>
                </div>

                {/* Match Score Indicator */}
                {typeof app.matchScore === 'number' && (
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <Target className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Skill Match Score</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      app.matchScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      app.matchScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {app.matchScore}%
                    </span>
                  </div>
                )}

                {/* Description Snippet */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  {app.jobDescription}
                </p>

                {/* Missing skills preview if generated */}
                {app.missingSkills && app.missingSkills.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-medium text-slate-500">Missing Key Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {app.missingSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                          +{skill}
                        </span>
                      ))}
                      {app.missingSkills.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{app.missingSkills.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`btn-tailor-job-${app.id}`}
                  onClick={() => onSelectForTailor(app)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/80 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tailor with AI</span>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    id={`btn-view-details-${app.id}`}
                    onClick={() => onViewDetails(app)}
                    title="View Details & AI Assets"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    id={`btn-edit-job-${app.id}`}
                    onClick={() => onEditApplication(app)}
                    title="Edit Application"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    id={`btn-delete-job-${app.id}`}
                    onClick={() => onDeleteApplication(app.id)}
                    title="Delete Application"
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Role & Company</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied Date</th>
                  <th className="px-4 py-3">Match Score</th>
                  <th className="px-4 py-3">AI Assets</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredApplications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 text-sm">{app.jobTitle}</div>
                      <div className="text-slate-500">{app.companyName} {app.location ? `• ${app.location}` : ''}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{app.appliedDate}</td>
                    <td className="px-4 py-3">
                      {typeof app.matchScore === 'number' ? (
                        <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                          app.matchScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                          app.matchScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {app.matchScore}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {app.tailoredBullets || app.coverLetter ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                      ) : (
                        <span className="text-slate-400">Not Tailored</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectForTailor(app)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border border-indigo-200"
                        >
                          <Sparkles className="w-3 h-3" /> Tailor
                        </button>
                        <button
                          onClick={() => onViewDetails(app)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
