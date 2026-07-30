import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { JobDashboard } from './components/JobDashboard';
import { GeneratorView } from './components/GeneratorView';
import { SkillAnalysisView } from './components/SkillAnalysisView';
import { AnalyticsView } from './components/AnalyticsView';
import { AddJobModal } from './components/AddJobModal';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ProfileModal } from './components/ProfileModal';
import { CandidateProfile, JobApplication, ApplicationStatus, TailorResponse } from './types';
import { INITIAL_PROFILE, INITIAL_APPLICATIONS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'generator' | 'skills' | 'analytics'>('dashboard');

  // Load from local storage or initial defaults
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    try {
      const saved = localStorage.getItem('jobpulse_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem('jobpulse_applications');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('jobpulse_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to persist profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('jobpulse_applications', JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to persist applications', e);
    }
  }, [applications]);

  // Modal & Selection States
  const [selectedAppForTailor, setSelectedAppForTailor] = useState<JobApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingApp, setViewingApp] = useState<JobApplication | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Status Handler
  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : app))
    );
  };

  // Delete Handler
  const handleDeleteApplication = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  // Add or Edit Application
  const handleSaveApplication = (appData: Partial<JobApplication>) => {
    if (appData.id) {
      // Edit
      setApplications(prev =>
        prev.map(app => (app.id === appData.id ? { ...app, ...appData, updatedAt: new Date().toISOString().split('T')[0] } : app))
      );
    } else {
      // New
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        jobTitle: appData.jobTitle || 'Untitled Position',
        companyName: appData.companyName || 'Company',
        location: appData.location || '',
        salary: appData.salary || '',
        jobDescription: appData.jobDescription || '',
        status: appData.status || 'Pending',
        appliedDate: appData.appliedDate || new Date().toISOString().split('T')[0],
        notes: appData.notes || '',
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setApplications(prev => [newApp, ...prev]);
    }
  };

  // Select Application for Tailoring
  const handleSelectForTailor = (app: JobApplication) => {
    setSelectedAppForTailor(app);
    setActiveTab('generator');
  };

  // Save generated assets back to Dashboard application
  const handleSaveTailoredToDashboard = (appData: Partial<JobApplication>, tailoredAssets: TailorResponse) => {
    if (appData.id) {
      // Update existing
      setApplications(prev =>
        prev.map(app =>
          app.id === appData.id
            ? {
                ...app,
                ...appData,
                matchScore: tailoredAssets.skillAnalysis.matchScore,
                matchedSkills: tailoredAssets.skillAnalysis.matchedSkills,
                missingSkills: tailoredAssets.skillAnalysis.missingSkills,
                tailoredBullets: tailoredAssets.bulletPoints,
                coverLetter: tailoredAssets.coverLetter,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : app
        )
      );
    } else {
      // Create new application with assets attached
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        jobTitle: appData.jobTitle || 'Tailored Position',
        companyName: appData.companyName || 'Target Company',
        jobDescription: appData.jobDescription || '',
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        matchScore: tailoredAssets.skillAnalysis.matchScore,
        matchedSkills: tailoredAssets.skillAnalysis.matchedSkills,
        missingSkills: tailoredAssets.skillAnalysis.missingSkills,
        tailoredBullets: tailoredAssets.bulletPoints,
        coverLetter: tailoredAssets.coverLetter,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setApplications(prev => [newApp, ...prev]);
    }
  };

  const interviewCount = applications.filter(a => a.status === 'Interview').length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        totalApplications={applications.length}
        interviewCount={interviewCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <JobDashboard
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onDeleteApplication={handleDeleteApplication}
            onOpenAddModal={() => {
              setEditingApp(null);
              setIsAddModalOpen(true);
            }}
            onSelectForTailor={handleSelectForTailor}
            onViewDetails={(app) => {
              setViewingApp(app);
              setIsDetailsModalOpen(true);
            }}
            onEditApplication={(app) => {
              setEditingApp(app);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {activeTab === 'generator' && (
          <GeneratorView
            profile={profile}
            applications={applications}
            selectedAppForTailor={selectedAppForTailor}
            onSaveToDashboard={handleSaveTailoredToDashboard}
            onClearSelectedApp={() => setSelectedAppForTailor(null)}
          />
        )}

        {activeTab === 'skills' && (
          <SkillAnalysisView profile={profile} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView applications={applications} />
        )}
      </main>

      {/* Modals */}
      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApplication}
        editingApp={editingApp}
      />

      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        app={viewingApp}
        profile={profile}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setViewingApp(null);
        }}
        onTailorAgain={handleSelectForTailor}
        onEdit={(app) => {
          setEditingApp(app);
          setIsAddModalOpen(true);
        }}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        profile={profile}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={setProfile}
      />
    </div>
  );
}
