
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { deploymentsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const chartConfig = {
  deployments: {
    label: "Deployments",
    color: "#607afb",
  },
};

const DeploymentChart = () => {
  const { data: deployments, isLoading } = useQuery({
    queryKey: ['deployments'],
    queryFn: () => deploymentsAPI.getAll(),
  });

  // Process data for chart - group by date
  const chartData = React.useMemo(() => {
    if (!deployments?.data) return [];
    
    const grouped = deployments.data.reduce((acc: any, deployment: any) => {
      const date = new Date(deployment.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .slice(-7) // Last 7 days
      .map(([date, count]) => ({
        date,
        deployments: count,
      }));
  }, [deployments]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Deployment Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#607afb]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Deployment Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="date" 
                stroke="#8e99cc"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#8e99cc"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="deployments" 
                fill="#607afb" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DeploymentChart;
