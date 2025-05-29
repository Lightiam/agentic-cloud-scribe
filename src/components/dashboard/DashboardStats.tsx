
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Activity, DollarSign, Clock } from 'lucide-react';

const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => userAPI.getDashboardStats(),
  });

  const statCards = [
    {
      title: 'Total Deployments',
      value: stats?.data?.total_deployments || 0,
      icon: Server,
      color: 'text-white',
      bgColor: 'bg-[#607afb]',
    },
    {
      title: 'Active Instances',
      value: stats?.data?.active_deployments || 0,
      icon: Activity,
      color: 'text-white',
      bgColor: 'bg-[#4a62d3]',
    },
    {
      title: 'Monthly Cost',
      value: `$${stats?.data?.total_cost || 0}`,
      icon: DollarSign,
      color: 'text-white',
      bgColor: 'bg-[#607afb]',
    },
    {
      title: 'Cloud Providers',
      value: stats?.data?.total_providers || 0,
      icon: Clock,
      color: 'text-white',
      bgColor: 'bg-[#4a62d3]',
    },
  ];

  if (isLoading) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-[#21284a] rounded-xl w-3/4 mb-2"></div>
                <div className="h-8 bg-[#21284a] rounded-xl w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8e99cc]">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default DashboardStats;
