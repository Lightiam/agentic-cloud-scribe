
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket, Cloud, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { deploymentsAPI } from '@/services/deploymentsService';
import { useToast } from '@/hooks/use-toast';

const DeploymentInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['aws']);
  const [autoTerminate, setAutoTerminate] = useState(24);
  const [environment, setEnvironment] = useState('dev');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const providers = [
    { id: 'aws', name: 'Amazon Web Services', color: 'bg-orange-500' },
    { id: 'azure', name: 'Microsoft Azure', color: 'bg-blue-500' },
    { id: 'gcp', name: 'Google Cloud Platform', color: 'bg-green-500' }
  ];

  const environments = [
    { value: 'dev', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'prod', label: 'Production' }
  ];

  const handleProviderToggle = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(p => p !== providerId)
        : [...prev, providerId]
    );
  };

  const handleDeploy = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please provide infrastructure description",
        variant: "destructive",
      });
      return;
    }

    if (selectedProviders.length === 0) {
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
        providers: selectedProviders,
        auto_terminate_hours: autoTerminate,
        environment
      });

      toast({
        title: "Deployment Started!",
        description: `Infrastructure deployment initiated. ID: ${response.data.deployment_id}`,
      });

      // Reset form
      setPrompt('');
      setSelectedProviders(['aws']);
      setAutoTerminate(24);
      setEnvironment('dev');

    } catch (error: any) {
      toast({
        title: "Deployment Failed",
        description: error.response?.data?.detail || "Failed to start deployment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const estimatedCost = selectedProviders.length * 0.5 * autoTerminate; // Simple estimation

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Infrastructure Deployment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Infrastructure Description */}
          <div>
            <Label className="text-gray-300 text-sm font-medium">
              Infrastructure Description
            </Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the infrastructure you want to deploy (e.g., 'Create a scalable web application with load balancer, database, and auto-scaling')"
              className="bg-slate-700 border-slate-600 text-white min-h-[120px] mt-2"
            />
          </div>

          {/* Cloud Providers */}
          <div>
            <Label className="text-gray-300 text-sm font-medium mb-3 block">
              Cloud Providers
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {providers.map(provider => (
                <div
                  key={provider.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedProviders.includes(provider.id)
                      ? 'border-cyan-400 bg-slate-700/50'
                      : 'border-slate-600 bg-slate-800/30 hover:bg-slate-700/30'
                  }`}
                  onClick={() => handleProviderToggle(provider.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedProviders.includes(provider.id)}
                      onChange={() => handleProviderToggle(provider.id)}
                    />
                    <div className={`w-3 h-3 rounded-full ${provider.color}`} />
                    <span className="text-white text-sm font-medium">
                      {provider.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300 text-sm font-medium">
                Environment
              </Label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {environments.map(env => (
                    <SelectItem key={env.value} value={env.value} className="text-white">
                      {env.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300 text-sm font-medium">
                Auto-terminate (hours)
              </Label>
              <Input
                type="number"
                value={autoTerminate}
                onChange={(e) => setAutoTerminate(Number(e.target.value))}
                min="1"
                max="168"
                className="bg-slate-700 border-slate-600 text-white mt-2"
              />
            </div>
          </div>

          {/* Cost Estimation */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">Estimated Cost</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-medium">${estimatedCost.toFixed(2)}</span>
                <Badge variant="outline" className="text-xs">
                  {autoTerminate}h runtime
                </Badge>
              </div>
            </div>
          </div>

          {/* Deploy Button */}
          <Button
            onClick={handleDeploy}
            disabled={loading || !prompt.trim() || selectedProviders.length === 0}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 h-12"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Deploying Infrastructure...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Deploy Infrastructure
              </div>
            )}
          </Button>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-300">
              Real cloud resources will be created and incur costs. Ensure you have configured your cloud provider credentials and understand the pricing implications.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentInterface;
