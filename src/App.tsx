/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/public/LandingPage';
import { FeaturesPage } from './components/public/FeaturesPage';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { IntegrationsPublicPage } from './components/public/IntegrationsPublicPage';
import { PricingPage } from './components/public/PricingPage';
import { SignInPage } from './components/public/SignInPage';
import { SignUpPage } from './components/public/SignUpPage';
import { LegalPage } from './components/public/LegalPage';
import { DeveloperPage } from './components/public/DeveloperPage';

import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { AgentsPage } from './components/agents/AgentsPage';
import { LeadFinderPage } from './components/leadFinder/LeadFinderPage';
import { BuyingSignalsPage } from './components/signals/BuyingSignalsPage';
import { ProspectsCRMPage } from './components/prospects/ProspectsCRMPage';
import { CampaignsPage } from './components/campaigns/CampaignsPage';
import { UnifiedInboxPage } from './components/inbox/UnifiedInboxPage';
import { MeetingsPage } from './components/meetings/MeetingsPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { IntegrationsPage } from './components/integrations/IntegrationsPage';
import { SettingsPage } from './components/settings/SettingsPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderContent = () => {
    switch (currentPage) {
      // Public Website
      case 'landing':
        return <LandingPage />;
      case 'features':
        return <FeaturesPage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'integrations-public':
        return <IntegrationsPublicPage />;
      case 'pricing':
        return <PricingPage />;
      case 'sign-in':
        return <SignInPage />;
      case 'sign-up':
        return <SignUpPage />;
      case 'privacy':
        return <LegalPage type="privacy" />;
      case 'terms':
        return <LegalPage type="terms" />;
      case 'developer':
        return <DeveloperPage />;

      // Authenticated Dashboard Workspaces
      case 'dashboard':
        return <OverviewDashboard />;
      case 'agents':
        return <AgentsPage />;
      case 'lead-finder':
        return <LeadFinderPage />;
      case 'buying-signals':
        return <BuyingSignalsPage />;
      case 'prospects':
        return <ProspectsCRMPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'inbox':
        return <UnifiedInboxPage />;
      case 'meetings':
        return <MeetingsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'settings':
        return <SettingsPage />;

      default:
        return <OverviewDashboard />;
    }
  };

  return <AppLayout>{renderContent()}</AppLayout>;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
