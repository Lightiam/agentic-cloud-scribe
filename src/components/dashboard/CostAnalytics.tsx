
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { deploymentsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const chartConfig = {
  aws: {
    label: "AWS",
    color: "#ff9500",
  },
  azure: {
    label: "Azure",
    color: "#0078d4",
  },
  gcp: {
    label: "GCP",
    color: "#4285f4",
  },
};

const CostAnalytics = () => {
  const { data: deployments, isLoading } = useQuery({
    queryKey: ['deployments'],
    queryFn: () => deploymentsAPI.getAll(),
  });

  const chartData = React.useMemo(() => {
    if (!deployments?.data) return [];
    
    const costs = deployments.data.reduce((acc: any, deployment: any) => {
      const providers = deployment.provider.split(',');
      providers.forEach((provider: string) => {
        const p = provider.trim().toLowerCase();
        acc[p] = (acc[p] || 0) + (deployment.cost_estimate || 0);
      });
      return acc;
    }, {});

    return Object.entries(costs).map(([provider, cost]) => ({
      name: provider.toUpperCase(),
      value: Number(cost),
      fill: chartConfig[provider as keyof typeof chartConfig]?.color || '#6b7280',
    }));
  }, [deployments]);

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Cost by Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Cost by Provider</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend 
                wrapperStyle={{ color: '#fff' }}
                formatter={(value) => `${value}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CostAnalytics;
