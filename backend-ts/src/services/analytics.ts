import { AppDataSource } from '../config/database';
import { Application, ApplicationStage } from '../models/Application';

export interface ApplicationStats {
  totalApplications: number;
  activeApplications: number;
  byStage: {
    saved: number;
    applied: number;
    screen: number;
    interview: number;
    offer: number;
    rejected: number;
  };
  averageTimeInStage: {
    savedToApplied: number | null;  // days
    appliedToScreen: number | null;
    screenToInterview: number | null;
    interviewToOffer: number | null;
  };
  successRate: {
    appliedRate: number;  // % that moved from saved to applied
    screenRate: number;  // % that got to screen
    interviewRate: number;  // % that got to interview
    offerRate: number;  // % that got offers
  };
}

export interface TimelineData {
  date: string;  // YYYY-MM-DD
  saved: number;
  applied: number;
  screen: number;
  interview: number;
  offer: number;
}

export interface TopCompany {
  company: string;
  count: number;
  stages: string[];
}

export interface TopRole {
  role: string;
  count: number;
}

export interface InsightsData {
  stats: ApplicationStats;
  timeline: TimelineData[];  // Last 30 days
  topCompanies: TopCompany[];  // Top 10
  topRoles: TopRole[];  // Top 10
  recentActivity: Application[];  // Last 5
}

function calculateDaysBetween(date1: Date | undefined, date2: Date | undefined): number | null {
  if (!date1 || !date2) return null;
  const diff = new Date(date2).getTime() - new Date(date1).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export async function getInsightsData(): Promise<InsightsData> {
  const applicationRepo = AppDataSource.getRepository(Application);

  // Fetch all applications with job details
  const applications = await applicationRepo.find({
    relations: ['job'],
    order: { createdAt: 'DESC' },
  });

  const totalApplications = applications.length;
  const activeApplications = applications.filter(
    app => ![ApplicationStage.OFFER, ApplicationStage.REJECTED].includes(app.stage as ApplicationStage)
  ).length;

  // Count by stage
  const byStage = {
    saved: applications.filter(app => app.stage === ApplicationStage.SAVED).length,
    applied: applications.filter(app => app.stage === ApplicationStage.APPLIED).length,
    screen: applications.filter(app => app.stage === ApplicationStage.SCREEN).length,
    interview: applications.filter(app => app.stage === ApplicationStage.INTERVIEW).length,
    offer: applications.filter(app => app.stage === ApplicationStage.OFFER).length,
    rejected: applications.filter(app => app.stage === ApplicationStage.REJECTED).length,
  };

  // Calculate average time in each stage
  const timesInStage: Record<string, number[]> = {
    savedToApplied: [],
    appliedToScreen: [],
    screenToInterview: [],
    interviewToOffer: [],
  };

  applications.forEach(app => {
    if (app.appliedDate) {
      const days = calculateDaysBetween(app.createdAt, app.appliedDate);
      if (days !== null) timesInStage.savedToApplied.push(days);
    }
    if (app.appliedDate && app.screenDate) {
      const days = calculateDaysBetween(app.appliedDate, app.screenDate);
      if (days !== null) timesInStage.appliedToScreen.push(days);
    }
    if (app.screenDate && app.interviewDate) {
      const days = calculateDaysBetween(app.screenDate, app.interviewDate);
      if (days !== null) timesInStage.screenToInterview.push(days);
    }
    if (app.interviewDate && app.offerDate) {
      const days = calculateDaysBetween(app.interviewDate, app.offerDate);
      if (days !== null) timesInStage.interviewToOffer.push(days);
    }
  });

  const averageTimeInStage = {
    savedToApplied: timesInStage.savedToApplied.length > 0
      ? Math.round(timesInStage.savedToApplied.reduce((a, b) => a + b, 0) / timesInStage.savedToApplied.length)
      : null,
    appliedToScreen: timesInStage.appliedToScreen.length > 0
      ? Math.round(timesInStage.appliedToScreen.reduce((a, b) => a + b, 0) / timesInStage.appliedToScreen.length)
      : null,
    screenToInterview: timesInStage.screenToInterview.length > 0
      ? Math.round(timesInStage.screenToInterview.reduce((a, b) => a + b, 0) / timesInStage.screenToInterview.length)
      : null,
    interviewToOffer: timesInStage.interviewToOffer.length > 0
      ? Math.round(timesInStage.interviewToOffer.reduce((a, b) => a + b, 0) / timesInStage.interviewToOffer.length)
      : null,
  };

  // Calculate success rates
  const appliedCount = byStage.applied + byStage.screen + byStage.interview + byStage.offer;
  const screenCount = byStage.screen + byStage.interview + byStage.offer;
  const interviewCount = byStage.interview + byStage.offer;
  const offerCount = byStage.offer;

  const successRate = {
    appliedRate: totalApplications > 0 ? Math.round((appliedCount / totalApplications) * 100) : 0,
    screenRate: appliedCount > 0 ? Math.round((screenCount / appliedCount) * 100) : 0,
    interviewRate: appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0,
    offerRate: appliedCount > 0 ? Math.round((offerCount / appliedCount) * 100) : 0,
  };

  // Generate timeline (last 30 days)
  const timeline: TimelineData[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const appsOnDate = applications.filter(app => {
      const appDate = new Date(app.createdAt).toISOString().split('T')[0];
      return appDate === dateStr;
    });

    timeline.push({
      date: dateStr,
      saved: appsOnDate.filter(app => app.stage === ApplicationStage.SAVED).length,
      applied: appsOnDate.filter(app => app.stage === ApplicationStage.APPLIED).length,
      screen: appsOnDate.filter(app => app.stage === ApplicationStage.SCREEN).length,
      interview: appsOnDate.filter(app => app.stage === ApplicationStage.INTERVIEW).length,
      offer: appsOnDate.filter(app => app.stage === ApplicationStage.OFFER).length,
    });
  }

  // Top companies
  const companyMap = new Map<string, { count: number; stages: Set<string> }>();
  applications.forEach(app => {
    if (app.job?.company) {
      const existing = companyMap.get(app.job.company) || { count: 0, stages: new Set() };
      existing.count++;
      existing.stages.add(app.stage);
      companyMap.set(app.job.company, existing);
    }
  });

  const topCompanies = Array.from(companyMap.entries())
    .map(([company, data]) => ({
      company,
      count: data.count,
      stages: Array.from(data.stages),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top roles
  const roleMap = new Map<string, number>();
  applications.forEach(app => {
    if (app.job?.role) {
      roleMap.set(app.job.role, (roleMap.get(app.job.role) || 0) + 1);
    }
  });

  const topRoles = Array.from(roleMap.entries())
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Recent activity (last 5 applications)
  const recentActivity = applications.slice(0, 5);

  return {
    stats: {
      totalApplications,
      activeApplications,
      byStage,
      averageTimeInStage,
      successRate,
    },
    timeline,
    topCompanies,
    topRoles,
    recentActivity,
  };
}
