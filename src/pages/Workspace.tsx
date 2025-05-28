
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import PromptInterface from '@/components/workspace/PromptInterface';

const Workspace = () => {
  const { isAuthenticated, loading } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      <WorkspaceSidebar 
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      <div className="flex-1">
        <PromptInterface conversationId={selectedConversation} />
      </div>
    </div>
  );
};

export default Workspace;
