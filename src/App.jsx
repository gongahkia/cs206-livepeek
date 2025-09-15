import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import NewsFeed from './components/NewsFeed';
import Onboarding from './components/Onboarding';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState('feed'); // 'feed' or 'profile'
  const [userProfile, setUserProfile] = useState(null);

  const handleAuthComplete = (authData) => {
    setIsAuthenticated(true);
    setUserProfile(prev => ({ ...prev, ...authData }));
    // Show onboarding for new users, skip for returning users
    setShowOnboarding(authData.isNewUser);
  };

  const handleOnboardingComplete = (profile) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
    setShowOnboarding(false);
    setCurrentView('feed');
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(prev => ({ ...prev, ...updatedProfile }));
    setCurrentView('feed');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setShowOnboarding(false);
    setCurrentView('feed');
  };

  // Show authentication if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthComplete={handleAuthComplete} />;
  }

  // Show onboarding for new users
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show profile page
  if (currentView === 'profile') {
    return (
      <Profile 
        userProfile={userProfile}
        onProfileUpdate={handleProfileUpdate}
        onBack={() => setCurrentView('feed')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold text-gray-900">LivePeek</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">🇯🇵 Japan</span>
                <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                  <option value="japanese">🇯🇵 Japanese (More languages coming soon!)</option>
                </select>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-gray-900">{userProfile?.name || 'User'}</span>
                </div>
                <button
                  onClick={() => setCurrentView('profile')}
                  className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
                >
                  <span className="text-sm font-medium text-orange-700">
                    {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NewsFeed selectedCountry="Japan" userProfile={userProfile} />
      </main>
    </div>
  );
}

export default App;

