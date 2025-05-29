
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/services/apiConfig';

type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

const BackendStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');

  useEffect(() => {
    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkBackendConnection = async () => {
    try {
      // Try to make a simple request to check if backend is available
      await api.get('/pricing/tiers');
      setStatus('connected');
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || !error.response) {
        setStatus('disconnected');
      } else {
        // If we get a response (even an error), the backend is running
        setStatus('connected');
      }
    }
  };

  if (status === 'connected') {
    return null; // Don't show anything when connected
  }

  return (
    <Alert className="mb-4 border-[#607afb] bg-[#21284a]">
      <div className="flex items-center space-x-2">
        {status === 'checking' ? (
          <AlertCircle className="h-4 w-4 text-[#607afb]" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <AlertDescription className="text-sm text-white">
          {status === 'checking' 
            ? 'Checking backend connection...'
            : 'Backend server is not responding. Please start the backend server on http://localhost:5000'
          }
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default BackendStatus;
