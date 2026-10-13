# LeadFit AI — Premium B2B AI Sales Agent SaaS

LeadFit AI is a premium full-stack B2B AI sales agent SaaS inspired by modern autonomous revenue intelligence systems like Gojiberry.ai. It discovers verified prospects, identifies real-time buying signals (funding, hiring surges, leadership changes, tech stack adoption), scores ICP fit with explainable reasoning, and drafts human-in-the-loop personalized outreach sequences.

---

## 🌟 Key Features

1. **Public SaaS Platform**:
   - High-conversion Landing page with animated dashboard visualization
   - Features, How It Works, Integrations showcase, and Transparent Pricing
   - Sign In, Sign Up, Privacy Policy, and Terms of Service pages

2. **Autonomous AI Agents Hub**:
   - 7-step Onboarding & Agent Setup Wizard with server-side Gemini ICP suggestion capability
   - 5 specialized agent roles: *Prospect Discovery Agent*, *Buying Signal Research Agent*, *Lead Qualification Agent*, *Outreach Personalization Agent*, and *Reply Classification Assistant*
   - Real-time agent status controls (Start, Pause, Configure) and execution logs

3. **Lead Finder & Prospect CRM**:
   - Granular search by title, company, industry, location, and employee count
   - Real CSV batch import and CSV export utilities
   - Comprehensive prospect profile drawer with company research briefs, buying signal timelines, and notes

4. **Buying Signal Radar**:
   - External trigger event tracking: VC funding rounds, open SDR hiring surges, C-level executive transitions, and tech stack adoption
   - Clear distinction between verified source links and AI-generated relevance interpretations

5. **Campaign Builder & Sequences**:
   - Multi-channel sequences (Email & LinkedIn steps)
   - Dynamic personalization variables (`{{firstName}}`, `{{company}}`, `{{title}}`, `{{recentSignal}}`)
   - Strict human-in-the-loop approval: no outbound message is dispatched without explicit user review

6. **Unified Inbox**:
   - Single inbox for inbound prospect responses across all channels
   - Gemini-powered sentiment and intent classification
   - Context-aware reply draft generation and one-click calendar booking

7. **Meetings & Analytics**:
   - Scheduled prospect meetings tracking with Google Meet link synchronization
   - Discovery velocity trends, ICP qualification distribution, signal source conversion attribution, and CSV report export

8. **Integrations & Security**:
   - Server-side Gemini 3.8 Flash API routes with strict input validation
   - Adapters for Google Workspace, Microsoft 365, Salesforce, HubSpot, LinkedIn, and Webhooks
   - Server-only API key handling with zero client credential exposure

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Environment Variables

Configure your `.env` file (see `.env.example`):

```bash
# GEMINI_API_KEY: Attached via AI Studio Secrets or GCP console
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# APP_URL: Current hosting origin
APP_URL="http://localhost:3000"
```

### Installation

```bash
npm install
```

### Running Locally (Full-Stack Dev Server)

```bash
npm run dev
```

The application will start at `http://localhost:3000` with the Express API backend mounted alongside Vite dev middleware.

### Production Build & Deployment

```bash
npm run build
npm start
```

---

## 🛡️ Anti-Spam & Human Oversight

LeadFit AI adheres to strict sales outreach ethics:
- Outbound messages **never** send autonomously without human approval.
- All email addresses and signals cite verifiable public sources.
- Billing is clearly marked as demonstration access until a merchant gateway is connected.
