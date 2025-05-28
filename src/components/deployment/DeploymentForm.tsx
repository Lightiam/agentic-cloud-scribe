
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deploymentsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const DeploymentForm: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [providers, setProviders] = useState<string[]>(['aws']);
  const [autoTerminateHours, setAutoTerminateHours] = useState<number>(24);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleProviderChange = (provider: string, checked: boolean) => {
    if (checked) {
      setProviders(prev => [...prev, provider]);
    } else {
      setProviders(prev => prev.filter(p => p !== provider));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (providers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one cloud provider",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await deploymentsAPI.create({
        prompt,
        providers,
        auto_terminate_hours: autoTerminateHours,
      });
      
      toast({
        title: "Success",
        description: `Deployment created! ID: ${response.data.deployment_id}`,
      });
      
      // Reset form
      setPrompt('');
      setProviders(['aws']);
      setAutoTerminateHours(24);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Deployment failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Create New Deployment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Infrastructure Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the infrastructure you want to deploy (e.g., 'Create a web server with load balancer on AWS')"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cloud Providers
            </label>
            <div className="space-y-2">
              {['aws', 'azure', 'gcp'].map((provider) => (
                <label key={provider} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={providers.includes(provider)}
                    onChange={(e) => handleProviderChange(provider, e.target.checked)}
                    className="rounded border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400"
                  />
                  <span className="text-white capitalize">{provider}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Auto-terminate after (hours)
            </label>
            <input
              type="number"
              value={autoTerminateHours}
              onChange={(e) => setAutoTerminateHours(Number(e.target.value))}
              min="1"
              max="168"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
          >
            {loading ? 'Creating Deployment...' : 'Deploy Infrastructure'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeploymentForm;
