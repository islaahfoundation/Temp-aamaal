import React from 'react';
import HomePage from './pages/home/HomePage';
import TasbihPage from './pages/tasbih/TasbihPage';
import DuasPage from './pages/duas/DuasPage';
import SettingsPage from './pages/settings/SettingsPage';

export default function AppRouter({
  activeTab,
  state,
  searchQuery,
  updateState,
  onNavigateTab,
  onSearchDuas,
  onOpenModal,
  onToggleBookmark,
  onToggleReminders,
  onResetAll,
  onShowToast
}) {
  switch (activeTab) {
    case 'tasbih':
      return (
        <TasbihPage
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
        />
      );
    case 'duas':
      return (
        <DuasPage
          state={state}
          searchQuery={searchQuery}
          onSelectFilter={(filter) => updateState({ activeDuaFilter: filter })}
          onToggleBookmark={onToggleBookmark}
          onOpenModal={onOpenModal}
        />
      );
    case 'more':
      return (
        <SettingsPage
          state={state}
          updateState={updateState}
          onResetAll={onResetAll}
          onShowToast={onShowToast}
        />
      );
    case 'home':
    default:
      return (
        <HomePage
          state={state}
          onNavigateTab={onNavigateTab}
          onSearchDuas={onSearchDuas}
          onOpenModal={onOpenModal}
          onToggleReminders={onToggleReminders}
          onShowToast={onShowToast}
        />
      );
  }
}
