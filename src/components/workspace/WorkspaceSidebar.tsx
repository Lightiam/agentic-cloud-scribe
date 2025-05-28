
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, Settings, User, Home, BarChart3 } from 'lucide-react';

interface WorkspaceSidebarProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string | null) => void;
}

const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  selectedConversation,
  onSelectConversation,
}) => {
  const { user, logout } = useAuth();
  const [conversations] = useState([
    { id: '1', title: 'AWS EC2 Deployment', date: 'Today' },
    { id: '2', title: 'Azure VM Setup', date: 'Yesterday' },
    { id: '3', title: 'GCP Kubernetes Cluster', date: 'Previous 7 Days' },
  ]);

  const handleNewChat = () => {
    onSelectConversation(null);
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="w-80 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <Button 
          onClick={handleNewChat}
          className="w-full bg-transparent border border-slate-600 text-white hover:bg-slate-700 flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          New Infrastructure
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700"
          onClick={() => handleNavigation('/dashboard')}
        >
          <Home className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700"
          onClick={() => handleNavigation('/profile')}
        >
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Deployments</h3>
          <div className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedConversation === conv.id
                    ? 'bg-slate-700 text-white'
                    : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-gray-500">{conv.date}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-xs text-gray-400 truncate">Free Plan</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-gray-400 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-gray-400 hover:text-white"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSidebar;
