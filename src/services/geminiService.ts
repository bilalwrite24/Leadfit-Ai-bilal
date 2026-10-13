/**
 * Client-side service to communicate with backend Gemini API routes.
 * Never calls Gemini API directly from browser code.
 */

export interface SuggestedICPResponse {
  targetIndustries: string[];
  companySizes: string[];
  decisionMakerRoles: string[];
  targetGeographies: string[];
  highPrioritySignals: string[];
  qualificationRationale: string;
}

export interface ResearchCompanyResponse {
  summary: string;
  keyAngles: string[];
}

export interface ExplainQualificationResponse {
  explanation: string;
  strengths: string[];
  risks: string[];
  recommendedNextStep: string;
}

export interface DraftOutreachResponse {
  subject?: string;
  body: string;
  confidence: number;
  personalizationPoints: string[];
}

export interface ClassifyReplyResponse {
  sentiment: string;
  intentCategory: string;
  confidence: number;
  keyObjections?: string[];
  suggestedReply: string;
}

export async function fetchSuggestedICP(params: {
  companyName: string;
  website: string;
  description: string;
  products: string;
}): Promise<SuggestedICPResponse> {
  const res = await fetch('/api/gemini/suggest-icp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  const data = await res.json();
  return data.data;
}

export async function fetchCompanyResearch(params: {
  companyName: string;
  industry: string;
  rawNotes?: string;
}): Promise<ResearchCompanyResponse> {
  const res = await fetch('/api/gemini/research-company', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  return await res.json();
}

export async function fetchQualificationExplanation(params: {
  prospectName: string;
  company: string;
  score: number;
  signals?: any[];
  icpCriteria?: any;
}): Promise<ExplainQualificationResponse> {
  const res = await fetch('/api/gemini/explain-qualification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  return await res.json();
}

export async function fetchDraftOutreach(params: {
  prospectName: string;
  title: string;
  company: string;
  channel: 'email' | 'linkedin';
  signalContext?: string;
  valueProposition?: string;
}): Promise<DraftOutreachResponse> {
  const res = await fetch('/api/gemini/draft-outreach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  return await res.json();
}

export async function fetchClassifyReply(params: {
  prospectMessage: string;
}): Promise<ClassifyReplyResponse> {
  const res = await fetch('/api/gemini/classify-reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  return await res.json();
}

export async function fetchLiveDiscoverLeads(params: {
  query?: string;
  industry?: string;
  location?: string;
  role?: string;
  employeeCount?: string;
}): Promise<{ success: boolean; source: string; prospects: any[] }> {
  const res = await fetch('/api/gemini/live-discover-leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  return await res.json();
}

export async function fetchGeminiChat(params: {
  messages: { role: 'user' | 'assistant'; text: string }[];
  userMessage: string;
}): Promise<{ success: boolean; text: string; source: string }> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  return await res.json();
}

