
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DeploymentChart from '@/components/dashboard/DeploymentChart';
import RecentDeployments from '@/components/dashboard/RecentDeployments';
import CostAnalytics from '@/components/dashboard/CostAnalytics';

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101323] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#607afb]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#101323]">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-white mb-2 tracking-light leading-tight">Dashboard</h1>
          <p className="text-[#8e99cc] text-sm">Monitor your infrastructure deployments and analytics</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <DashboardStats />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DeploymentChart />
          <CostAnalytics />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <RecentDeployments />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
