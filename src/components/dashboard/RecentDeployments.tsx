
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { deploymentsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RecentDeployments = () => {
  const { toast } = useToast();
  const { data: deployments, isLoading, refetch } = useQuery({
    queryKey: ['deployments'],
    queryFn: () => deploymentsAPI.getAll(),
  });

  const handleTerminate = async (deploymentId: string) => {
    try {
      await deploymentsAPI.terminate(deploymentId);
      toast({
        title: "Success",
        description: "Deployment terminated successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate deployment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      running: "default",
      pending: "secondary",
      terminated: "destructive",
      failed: "destructive",
    };
    
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentDeployments = deployments?.data?.slice(0, 10) || [];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Deployments</CardTitle>
      </CardHeader>
      <CardContent>
        {recentDeployments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No deployments found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-600">
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Provider</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Cost/hr</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDeployments.map((deployment: any) => (
                <TableRow key={deployment.deployment_id} className="border-slate-600 hover:bg-slate-700/50">
                  <TableCell className="text-white font-mono text-sm">
                    {deployment.deployment_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-gray-300 capitalize">
                    {deployment.provider}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(deployment.status)}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    ${deployment.cost_estimate?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(deployment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {deployment.status === 'running' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => handleTerminate(deployment.deployment_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDeployments;
