/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BotDataProvider } from './context/BotDataContext';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CommandManager } from './components/commands/CommandManager';
import { TicketCenter } from './components/tickets/TicketCenter';
import { AutoModView } from './components/automod/AutoModView';
import { EconomyView } from './components/economy/EconomyView';
import { DiscordSimulator } from './components/simulator/DiscordSimulator';
import { DeploymentGuide } from './components/deployment/DeploymentGuide';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');
  const [simCommandToRun, setSimCommandToRun] = useState<string | null>(null);

  const handleTestInSimulator = (cmdName: string) => {
    setSimCommandToRun(cmdName);
    setActiveTab('simulator');
  };

  return (
    <div className="flex h-screen bg-[#0c0d12] text-slate-100 overflow-hidden font-sans select-none">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 bg-[#0c0d12]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'commands' && <CommandManager onTestInSimulator={handleTestInSimulator} />}
            {activeTab === 'tickets' && <TicketCenter />}
            {activeTab === 'automod' && <AutoModView />}
            {activeTab === 'economy' && <EconomyView />}
            {activeTab === 'simulator' && <DiscordSimulator initialCommandToRun={simCommandToRun} />}
            {activeTab === 'deploy' && <DeploymentGuide />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BotDataProvider>
      <AppContent />
    </BotDataProvider>
  );
}
