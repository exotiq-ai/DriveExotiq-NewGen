'use client';

import React, { useState, useMemo } from 'react';
import { Application } from '@/types';
import StatusBadge from './StatusBadge';
import ApplicationDetails from './ApplicationDetails';

interface ApplicationsTableProps {
  applications: Application[];
  onUpdate: (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => Promise<void>;
  onRefresh: () => void;
}

type SortField = 'created_at' | 'full_name' | 'status' | 'city_of_interest';
type SortOrder = 'asc' | 'desc';

export default function ApplicationsTable({ applications, onUpdate, onRefresh }: ApplicationsTableProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Get unique cities for filter
  const cities = useMemo(() => {
    const uniqueCities = new Set(applications.map((app) => app.city_of_interest));
    return Array.from(uniqueCities).sort();
  }, [applications]);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.full_name.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          app.phone.includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter((app) => app.city_of_interest === cityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [applications, searchQuery, statusFilter, cityFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleUpdateAndRefresh = async (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => {
    await onUpdate(id, status, notes);
    onRefresh();
  };

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === 'pending').length,
      approved: applications.filter((a) => a.status === 'approved').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-graphite border border-metallic-silver/30 rounded-lg p-4">
          <div className="text-metallic-silver text-sm">Total</div>
          <div className="text-pure-white text-2xl font-bold mt-1">{stats.total}</div>
        </div>
        <div className="bg-graphite border border-performance-orange/30 rounded-lg p-4">
          <div className="text-metallic-silver text-sm">Pending</div>
          <div className="text-performance-orange text-2xl font-bold mt-1">{stats.pending}</div>
        </div>
        <div className="bg-graphite border border-green-500/30 rounded-lg p-4">
          <div className="text-metallic-silver text-sm">Approved</div>
          <div className="text-green-400 text-2xl font-bold mt-1">{stats.approved}</div>
        </div>
        <div className="bg-graphite border border-red-500/30 rounded-lg p-4">
          <div className="text-metallic-silver text-sm">Rejected</div>
          <div className="text-red-400 text-2xl font-bold mt-1">{stats.rejected}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-graphite border border-metallic-silver/30 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-jet-grey text-pure-white border border-metallic-silver/30 rounded-md focus:outline-none focus:border-gulf-blue transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 bg-jet-grey text-pure-white border border-metallic-silver/30 rounded-md focus:outline-none focus:border-gulf-blue transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-4 py-2 bg-jet-grey text-pure-white border border-metallic-silver/30 rounded-md focus:outline-none focus:border-gulf-blue transition-colors"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-graphite border border-metallic-silver/30 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-jet-grey">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-metallic-silver uppercase tracking-wider cursor-pointer hover:text-gulf-blue"
                  onClick={() => handleSort('created_at')}
                >
                  Date {sortField === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-metallic-silver uppercase tracking-wider cursor-pointer hover:text-gulf-blue"
                  onClick={() => handleSort('full_name')}
                >
                  Name {sortField === 'full_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-metallic-silver uppercase tracking-wider">
                  Email
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-metallic-silver uppercase tracking-wider cursor-pointer hover:text-gulf-blue"
                  onClick={() => handleSort('city_of_interest')}
                >
                  City {sortField === 'city_of_interest' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-metallic-silver uppercase tracking-wider cursor-pointer hover:text-gulf-blue"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-metallic-silver uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-metallic-silver/30">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-metallic-silver">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-jet-grey/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-pure-white">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-pure-white font-medium">
                      {app.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-metallic-silver">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gulf-blue">{app.city_of_interest}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-gulf-blue hover:text-gulf-blue/80 font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <ApplicationDetails
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdate={handleUpdateAndRefresh}
        />
      )}
    </div>
  );
}





