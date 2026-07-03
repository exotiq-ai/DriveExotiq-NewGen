'use client';

import React, { useState } from 'react';
import { Application } from '@/types';
import StatusBadge from './StatusBadge';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';

interface ApplicationDetailsProps {
  application: Application;
  onClose: () => void;
  onUpdate: (id: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => Promise<void>;
}

export default function ApplicationDetails({ application, onClose, onUpdate }: ApplicationDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState(application.notes || '');

  const handleUpdateStatus = async (newStatus: 'pending' | 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      await onUpdate(application.id, newStatus, notes);
      onClose();
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-jet-grey border border-metallic-silver/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-jet-grey border-b border-metallic-silver/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-pure-white">Application Details</h2>
          <button
            onClick={onClose}
            className="text-metallic-silver hover:text-pure-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-metallic-silver mb-2">Status</label>
            <StatusBadge status={application.status} />
          </div>

          {/* Applicant Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-metallic-silver mb-1">Full Name</label>
              <p className="text-pure-white">{application.full_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-metallic-silver mb-1">Email</label>
              <p className="text-pure-white">{application.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-metallic-silver mb-1">Phone</label>
              <p className="text-pure-white">{application.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-metallic-silver mb-1">Current City</label>
              <p className="text-pure-white">{application.current_city}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-metallic-silver mb-1">City of Interest</label>
              <p className="text-pure-white font-medium text-gulf-blue">{application.city_of_interest}</p>
            </div>
            {application.invite_code && (
              <div>
                <label className="block text-sm font-medium text-metallic-silver mb-1">Invite Code</label>
                <p className="text-pure-white font-mono">{application.invite_code}</p>
              </div>
            )}
          </div>

          {/* Brief Intro */}
          <div>
            <label className="block text-sm font-medium text-metallic-silver mb-2">Why Drive Exotiq?</label>
            <p className="text-pure-white bg-graphite p-4 rounded-md border border-metallic-silver/30">
              {application.brief_intro}
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block font-medium text-metallic-silver mb-1">Submitted</label>
              <p className="text-pure-white">{formatDate(application.created_at)}</p>
            </div>
            {application.reviewed_at && (
              <div>
                <label className="block font-medium text-metallic-silver mb-1">Reviewed</label>
                <p className="text-pure-white">{formatDate(application.reviewed_at)}</p>
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-metallic-silver mb-2">Admin Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this application..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-metallic-silver/30">
            {application.status !== 'approved' && (
              <Button
                onClick={() => handleUpdateStatus('approved')}
                disabled={isUpdating}
                variant="primary"
                className="flex-1 min-w-[120px]"
              >
                {isUpdating ? 'Updating...' : 'Approve'}
              </Button>
            )}
            {application.status !== 'rejected' && (
              <Button
                onClick={() => handleUpdateStatus('rejected')}
                disabled={isUpdating}
                className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-700"
              >
                {isUpdating ? 'Updating...' : 'Reject'}
              </Button>
            )}
            {application.status !== 'pending' && (
              <Button
                onClick={() => handleUpdateStatus('pending')}
                disabled={isUpdating}
                className="flex-1 min-w-[120px] bg-performance-orange hover:bg-performance-orange/80"
              >
                {isUpdating ? 'Updating...' : 'Mark Pending'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





