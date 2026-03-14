export type ChatRole = "user" | "assistant" | "system";

export interface CachedChatMessage {
  id: string;
  chatId: string;
  role: ChatRole;
  content: string;
  createdAt: string; // ISO string
}

export interface CachedChatSession {
  chatId: string;
  userId: string;
  status: "active" | "finalized";
  startedAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CachedAssessmentHistoryItem {
  id: string;
  userId: string;
  quizType: string;
  score: number;
  createdAt: string; // ISO string
}

export interface CachedRoadmapHistoryItem {
  id: string;
  userId: string;
  title: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CachedIndustryInsights {
  industry: string;
  salaryRanges: unknown;
  growthRate: number;
  demandLevel: "HIGH" | "MEDIUM" | "LOW";
  topSkills: string[];
  marketOutlook: string;
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: string; // ISO
  nextUpdate: string; // ISO
}