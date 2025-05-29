
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
    const variants: Record<string, string> = {
      running: "bg-[#607afb] text-white",
      pending: "bg-[#4a62d3] text-white",
      terminated: "bg-[#21284a] text-[#8e99cc]",
      failed: "bg-red-500 text-white",
    };
    
    return (
      <Badge className={`capitalize rounded-xl ${variants[status] || "bg-[#21284a] text-[#8e99cc]"}`}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Recent Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-[#21284a] rounded-xl"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentDeployments = deployments?.data?.slice(0, 10) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Recent Deployments</CardTitle>
      </CardHeader>
      <CardContent>
        {recentDeployments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#8e99cc]">No deployments found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#2f396a]">
                <TableHead className="text-[#8e99cc]">ID</TableHead>
                <TableHead className="text-[#8e99cc]">Provider</TableHead>
                <TableHead className="text-[#8e99cc]">Status</TableHead>
                <TableHead className="text-[#8e99cc]">Cost/hr</TableHead>
                <TableHead className="text-[#8e99cc]">Created</TableHead>
                <TableHead className="text-[#8e99cc]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDeployments.map((deployment: any) => (
                <TableRow key={deployment.deployment_id} className="border-[#2f396a] hover:bg-[#21284a]">
                  <TableCell className="text-white font-mono text-sm">
                    {deployment.deployment_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-white capitalize">
                    {deployment.provider}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(deployment.status)}
                  </TableCell>
                  <TableCell className="text-white">
                    ${deployment.cost_estimate?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell className="text-white">
                    {new Date(deployment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="cloudSecondary" className="h-8 w-8 p-0 rounded-xl">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {deployment.status === 'running' && (
                        <Button
                          size="sm"
                          variant="cloud"
                          className="h-8 w-8 p-0 rounded-xl"
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
