'use client';

import React, { useState, useEffect } from 'react';
import { Application } from '@/types';
import ApplicationsTable from '@/components/admin/ApplicationsTable';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already authenticated (stored in session)
  useEffect(() => {
    const storedPassword = sessionStorage.getItem('admin_password');
    if (storedPassword) {
      setPassword(storedPassword);
      handleLogin(storedPassword);
    }
  }, []);

  const handleLogin = async (pwd?: string) => {
    const passwordToUse = pwd || password;
    setAuthError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/applications', {
        headers: {
          Authorization: `Bearer ${passwordToUse}`,
        },
      });

      if (response.status === 401) {
        setAuthError('Invalid password');
        sessionStorage.removeItem('admin_password');
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();
      setApplications(data.applications);
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_password', passwordToUse);
    } catch (err) {
      setAuthError('Authentication failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_password');
    setIsAuthenticated(false);
    setPassword('');
    setApplications([]);
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    setError('');

    try {
      const storedPassword = sessionStorage.getItem('admin_password');
      if (!storedPassword) {
        handleLogout();
        return;
      }

      const response = await fetch('/api/admin/applications', {
        headers: {
          Authorization: `Bearer ${storedPassword}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateApplication = async (
    id: string,
    status: 'pending' | 'approved' | 'rejected',
    notes?: string
  ) => {
    const storedPassword = sessionStorage.getItem('admin_password');
    if (!storedPassword) {
      handleLogout();
      return;
    }

    const response = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedPassword}`,
      },
      body: JSON.stringify({ id, status, notes }),
    });

    if (response.status === 401) {
      handleLogout();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error('Failed to update application');
    }
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-pure-white">Admin Login</h2>
            <p className="mt-2 text-metallic-silver">Enter your password to access the dashboard</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="mt-8 space-y-6 bg-graphite border border-metallic-silver/30 rounded-lg p-8"
          >
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-pure-white mb-2">
                Password
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                error={authError}
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-pure-white">Applications</h2>
            <p className="text-metallic-silver mt-1">Manage and review member applications</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.href = '/admin/instagram'} 
              variant="outline"
            >
              📱 Instagram Feed
            </Button>
            <Button onClick={fetchApplications} disabled={isLoading} variant="secondary">
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              Logout
            </Button>
          </div>
        </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">{error}</div>
      )}

      {isLoading && applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-metallic-silver">Loading applications...</div>
        </div>
      ) : (
        <ApplicationsTable
          applications={applications}
          onUpdate={handleUpdateApplication}
          onRefresh={fetchApplications}
        />
      )}
    </div>
  );
}

