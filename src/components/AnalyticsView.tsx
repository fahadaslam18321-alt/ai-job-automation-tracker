import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Target, 
  Clock, 
  FileText, 
  MessageSquare, 
  AlertCircle,
  CheckCircle2,
  Percent,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { JobApplication } from '../types';

interface AnalyticsViewProps {
  applications: JobApplication[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ applications }) => {
  const total = applications.length;
  const pending = applications.filter(a => a.status === 'Pending').length;
  const applied = applications.filter(a => a.status === 'Applied').length;
  const interviews = applications.filter(a => a.status === 'Interview').length;
  const offers = applications.filter(a => a.status === 'Offer').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;

  const responseRate = total > 0 ? Math.round(((interviews + offers + rejected) / total) * 100) : 0;
  const interviewRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;
  const offerRate = interviews > 0 ? Math.round((offers / interviews) * 100) : 0;

  // Calculate average match score
  const scores = applications.map(a => a.matchScore).filter((s): s is number => typeof s === 'number');
  const avgMatchScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // Aggregate top missing skills across all job applications
  const missingSkillsMap: Record<string, number> = {};
  applications.forEach(app => {
    if (app.missingSkills) {
      app.missingSkills.forEach(skill => {
        missingSkillsMap[skill] = (missingSkillsMap[skill] || 0) + 1;
      });
    }
  });

  const sortedMissingSkills = Object.entries(missingSkillsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Recharts Pipeline Funnel Data
  const funnelData = [
    { stage: 'Pending', count: pending, fill: '#f59e0b' },
    { stage: 'Applied', count: applied, fill: '#3b82f6' },
    { stage: 'Interview', count: interviews, fill: '#6366f1' },
    { stage: 'Offer', count: offers, fill: '#10b981' },
    { stage: 'Rejected', count: rejected, fill: '#f43f5e' },
  ];

  // Recharts Skill Gaps Data
  const skillGapChartData = sortedMissingSkills.map(([skill, count]) => ({
    name: skill.length > 14 ? `${skill.slice(0, 13)}…` : skill,
    fullName: skill,
    Jobs: count
  }));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Application Analytics & Insights</h1>
        <p className="text-slate-500 text-sm mt-1">
          Pipeline conversion metrics, response rates, and skill gap patterns across target roles.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Interview Conversion</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">{interviewRate}%</div>
          <div className="text-xs text-slate-500">Applications reaching interview stage</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Employer Response Rate</span>
            <Percent className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600">{responseRate}%</div>
          <div className="text-xs text-slate-500">Decisions or interview invites received</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Average Match Score</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{avgMatchScore}%</div>
          <div className="text-xs text-slate-500">Average alignment across target JDs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Offers Received</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-500">{offers}</div>
          <div className="text-xs text-slate-500">{offerRate}% offer rate from interviews</div>
        </div>
      </div>

      {/* Main Breakdown Section with Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recharts Pipeline Funnel Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Application Pipeline Funnel
            </h3>
            <span className="text-xs text-slate-400 font-medium">{total} Total Applications</span>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} Applications`, 'Count']}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-around gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
            {funnelData.map((d) => (
              <div key={d.stage} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span>{d.stage}: <strong>{d.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Recharts Top Missing Skills Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Skill Gap Frequency Analysis
            </h3>
            <span className="text-xs text-slate-400 font-medium">Target JD Requirements</span>
          </div>

          {skillGapChartData.length === 0 ? (
            <div className="text-center text-xs text-slate-400 py-20">
              No missing skill gap data yet. Tailor applications in Generator or Dashboard to populate data.
            </div>
          ) : (
            <div className="w-full h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGapChartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#334155', fontSize: 11 }} angle={-20} textAnchor="end" />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => [`Required in ${value} job(s)`, 'Frequency']}
                  />
                  <Bar dataKey="Jobs" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
