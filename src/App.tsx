/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LeadFinderPage } from './components/leadFinder/LeadFinderPage';
import { DeveloperPage } from './components/public/DeveloperPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <AppLayout>
      {currentPage === 'developer' ? <DeveloperPage /> : <LeadFinderPage />}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
