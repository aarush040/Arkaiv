/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import OnboardingView from './components/OnboardingView';
import DashboardView from './components/DashboardView';
import LoginView from './components/LoginView';
import { AuthUser } from './types';
import authService from './services/authService';
import progressService from './services/progressService';

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<{
    goal: string;
    level: string;
    commitment: number;
    duration: number;
    marksheetUploaded?: boolean;
    marksheetName?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from backend on bootup
  useEffect(() => {
    const token = localStorage.getItem('arkaiv_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    authService.getMe()
      .then((userData) => {
        setAuthUser({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
        });

        // Load progress from backend
        return progressService.getProgress();
      })
      .then((progressData: any) => {
        if (progressData && progressData.goal) {
          setProfile({
            goal: progressData.goal,
            level: progressData.level || 'B.Tech 2nd Year',
            commitment: progressData.commitment || 2,
            duration: progressData.duration || 12,
            marksheetUploaded: progressData.marksheetUploaded || false,
            marksheetName: progressData.marksheetName,
          });
        }
      })
      .catch(() => {
        // Token invalid or server not reachable — clear stored token
        localStorage.removeItem('arkaiv_token');
        localStorage.removeItem('arkaiv_refresh_token');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLoginSuccess = async (user: AuthUser, isRegisterFlow: boolean) => {
    setAuthUser(user);

    // Try loading profile from backend
    try {
      const progressData: any = await progressService.getProgress();
      if (progressData && progressData.goal) {
        setProfile({
          goal: progressData.goal,
          level: progressData.level || 'B.Tech 2nd Year',
          commitment: progressData.commitment || 2,
          duration: progressData.duration || 12,
          marksheetUploaded: progressData.marksheetUploaded || false,
          marksheetName: progressData.marksheetName,
        });
        return;
      }
    } catch {
      // No progress saved yet - user will go through onboarding
    }

    if (!isRegisterFlow) {
      // Returning user without progress data — show onboarding to set up
      setProfile(null);
    } else {
      // New registration — go to onboarding
      setProfile(null);
    }
  };

  const handleOnboardingComplete = async (data: {
    goal: string;
    level: string;
    commitment: number;
    duration: number;
    marksheetUploaded?: boolean;
    marksheetName?: string;
  }) => {
    if (!authUser) return;
    setProfile(data);

    try {
      await progressService.saveProgress({
        goal: data.goal,
        level: data.level,
        commitment: data.commitment,
        duration: data.duration,
        marksheetUploaded: data.marksheetUploaded,
        marksheetName: data.marksheetName,
      });
    } catch (err) {
      console.warn('Failed to save progress to backend:', err);
    }
  };

  const handleLogOut = async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed with local cleanup even if server call fails
    }
    setAuthUser(null);
    setProfile(null);
  };

  const handleRedoOnboarding = () => {
    setProfile(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-indigo-400 text-sm font-bold animate-pulse">Restoring session...</div>
      </div>
    );
  }

  return (
    <div id="arkaiv-root" className="min-h-screen">
      {!authUser ? (
        <LoginView onLoginSuccess={handleLoginSuccess} />
      ) : !profile ? (
        <OnboardingView onComplete={handleOnboardingComplete} />
      ) : (
        <DashboardView 
          initialProfile={profile} 
          onLogOut={handleLogOut} 
          user={authUser} 
          onRedoOnboarding={handleRedoOnboarding} 
        />
      )}
    </div>
  );
}

