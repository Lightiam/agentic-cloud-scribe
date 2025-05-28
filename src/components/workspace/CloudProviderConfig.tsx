
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Settings, Plus, CheckCircle } from 'lucide-react';
import { cloudProvidersAPI } from '@/services/cloudProvidersService';
import { useToast } from '@/hooks/use-toast';

const CloudProviderConfig: React.FC = () => {
  const [awsCredentials, setAwsCredentials] = useState({
    access_key_id: '',
    secret_access_key: '',
    region: 'us-east-1'
  });
  
  const [azureCredentials, setAzureCredentials] = useState({
    client_id: '',
    client_secret: '',
    tenant_id: '',
    subscription_id: ''
  });
  
  const [gcpCredentials, setGcpCredentials] = useState({
    project_id: '',
    private_key: '',
    client_email: ''
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveCredentials = async (provider: string, credentials: any) => {
    setLoading(true);
    try {
      await cloudProvidersAPI.add({
        provider_name: provider,
        credentials
      });
      
      toast({
        title: "Success",
        description: `${provider.toUpperCase()} credentials saved successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to save credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Cloud Provider Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="aws" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="aws" className="text-white">AWS</TabsTrigger>
            <TabsTrigger value="azure" className="text-white">Azure</TabsTrigger>
            <TabsTrigger value="gcp" className="text-white">GCP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="aws" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-gray-300">Access Key ID</Label>
                <Input
                  value={awsCredentials.access_key_id}
                  onChange={(e) => setAwsCredentials({...awsCredentials, access_key_id: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="AKIA..."
                />
              </div>
              <div>
                <Label className="text-gray-300">Secret Access Key</Label>
                <Input
                  type="password"
                  value={awsCredentials.secret_access_key}
                  onChange={(e) => setAwsCredentials({...awsCredentials, secret_access_key: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter secret key"
                />
              </div>
              <div>
                <Label className="text-gray-300">Default Region</Label>
                <Input
                  value={awsCredentials.region}
                  onChange={(e) => setAwsCredentials({...awsCredentials, region: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="us-east-1"
                />
              </div>
              <Button 
                onClick={() => handleSaveCredentials('aws', awsCredentials)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Save AWS Credentials
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="azure" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-gray-300">Client ID</Label>
                <Input
                  value={azureCredentials.client_id}
                  onChange={(e) => setAzureCredentials({...azureCredentials, client_id: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Client Secret</Label>
                <Input
                  type="password"
                  value={azureCredentials.client_secret}
                  onChange={(e) => setAzureCredentials({...azureCredentials, client_secret: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Tenant ID</Label>
                <Input
                  value={azureCredentials.tenant_id}
                  onChange={(e) => setAzureCredentials({...azureCredentials, tenant_id: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Subscription ID</Label>
                <Input
                  value={azureCredentials.subscription_id}
                  onChange={(e) => setAzureCredentials({...azureCredentials, subscription_id: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button 
                onClick={() => handleSaveCredentials('azure', azureCredentials)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Save Azure Credentials
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="gcp" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-gray-300">Project ID</Label>
                <Input
                  value={gcpCredentials.project_id}
                  onChange={(e) => setGcpCredentials({...gcpCredentials, project_id: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Service Account Email</Label>
                <Input
                  value={gcpCredentials.client_email}
                  onChange={(e) => setGcpCredentials({...gcpCredentials, client_email: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Private Key</Label>
                <Input
                  type="password"
                  value={gcpCredentials.private_key}
                  onChange={(e) => setGcpCredentials({...gcpCredentials, private_key: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button 
                onClick={() => handleSaveCredentials('gcp', gcpCredentials)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Save GCP Credentials
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CloudProviderConfig;
