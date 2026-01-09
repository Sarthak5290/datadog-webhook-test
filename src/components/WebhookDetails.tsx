'use client';

// Webhook details modal component

import { WebhookRecord } from '@/types/webhook';
import StatusBadge from './StatusBadge';
import { useState } from 'react';

interface WebhookDetailsProps {
  webhook: WebhookRecord | null;
  onClose: () => void;
}

export default function WebhookDetails({ webhook, onClose }: WebhookDetailsProps) {
  const [copied, setCopied] = useState(false);

  if (!webhook) return null;

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(webhook.payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Webhook Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Webhook Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                ID
              </label>
              <p className="text-sm text-gray-900 font-mono">{webhook.id}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Created At
              </label>
              <p className="text-sm text-gray-900">{formatDate(webhook.created_at)}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Status
              </label>
              <StatusBadge status={webhook.alert_status} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Priority
              </label>
              <p className="text-sm text-gray-900">{webhook.priority || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Service Name
              </label>
              <p className="text-sm text-gray-900">{webhook.service_name || 'N/A'}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Event Title
            </label>
            <p className="text-sm text-gray-900">{webhook.event_title}</p>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Event Message
            </label>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {webhook.event_msg || 'N/A'}
            </p>
          </div>

          {/* Full Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-500">
                Full JSON Payload
              </label>
              <button
                onClick={handleCopyPayload}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs overflow-x-auto">
              {JSON.stringify(webhook.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
