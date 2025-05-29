
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Settings, Plus, CheckCircle, Upload, FileJson } from 'lucide-react';
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
  const [uploadMode, setUploadMode] = useState<{[key: string]: 'manual' | 'json'}>({
    aws: 'manual',
    azure: 'manual',
    gcp: 'manual'
  });
  const { toast } = useToast();

  const handleFileUpload = (provider: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        switch (provider) {
          case 'aws':
            setAwsCredentials({
              access_key_id: jsonData.access_key_id || jsonData.accessKeyId || '',
              secret_access_key: jsonData.secret_access_key || jsonData.secretAccessKey || '',
              region: jsonData.region || 'us-east-1'
            });
            break;
          case 'azure':
            setAzureCredentials({
              client_id: jsonData.client_id || jsonData.clientId || jsonData.appId || '',
              client_secret: jsonData.client_secret || jsonData.clientSecret || jsonData.password || '',
              tenant_id: jsonData.tenant_id || jsonData.tenantId || jsonData.tenant || '',
              subscription_id: jsonData.subscription_id || jsonData.subscriptionId || ''
            });
            break;
          case 'gcp':
            setGcpCredentials({
              project_id: jsonData.project_id || '',
              private_key: jsonData.private_key || '',
              client_email: jsonData.client_email || ''
            });
            break;
        }
        
        toast({
          title: "Success",
          description: `${provider.toUpperCase()} credentials loaded from JSON file`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid JSON file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSaveCredentials = async (provider: string, credentials: any) => {
    // Validate credentials before saving
    const isEmpty = Object.values(credentials).some(value => !value || value.toString().trim() === '');
    if (isEmpty) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

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
      console.error('Error saving credentials:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to save credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCredentialForm = (provider: string, credentials: any, setCredentials: any, fields: any[]) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant={uploadMode[provider] === 'manual' ? 'default' : 'outline'}>
            Manual Input
          </Badge>
          <Badge variant={uploadMode[provider] === 'json' ? 'default' : 'outline'}>
            JSON Upload
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant={uploadMode[provider] === 'manual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMode({...uploadMode, [provider]: 'manual'})}
          >
            Manual
          </Button>
          <Button
            variant={uploadMode[provider] === 'json' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMode({...uploadMode, [provider]: 'json'})}
          >
            <FileJson className="h-4 w-4 mr-1" />
            JSON
          </Button>
        </div>
      </div>

      {uploadMode[provider] === 'json' && (
        <div className="mb-4">
          <Label className="text-gray-300">Upload JSON Credentials</Label>
          <div className="mt-2 flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-slate-700/50 hover:bg-slate-700">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">JSON files only</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(provider, file);
                }}
              />
            </label>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key}>
            <Label className="text-gray-300">{field.label}</Label>
            <Input
              type={field.type || 'text'}
              value={credentials[field.key]}
              onChange={(e) => setCredentials({...credentials, [field.key]: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder={field.placeholder}
            />
          </div>
        ))}
        <Button 
          onClick={() => handleSaveCredentials(provider, credentials)}
          disabled={loading}
          className={`w-full ${field.buttonClass}`}
        >
          {loading ? 'Saving...' : `Save ${provider.toUpperCase()} Credentials`}
        </Button>
      </div>
    </div>
  );

  const awsFields = [
    { key: 'access_key_id', label: 'Access Key ID', placeholder: 'AKIA...' },
    { key: 'secret_access_key', label: 'Secret Access Key', type: 'password', placeholder: 'Enter secret key' },
    { key: 'region', label: 'Default Region', placeholder: 'us-east-1' }
  ];

  const azureFields = [
    { key: 'client_id', label: 'Client ID', placeholder: 'Enter client ID' },
    { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'Enter client secret' },
    { key: 'tenant_id', label: 'Tenant ID', placeholder: 'Enter tenant ID' },
    { key: 'subscription_id', label: 'Subscription ID', placeholder: 'Enter subscription ID' }
  ];

  const gcpFields = [
    { key: 'project_id', label: 'Project ID', placeholder: 'Enter project ID' },
    { key: 'client_email', label: 'Service Account Email', placeholder: 'service-account@project.iam.gserviceaccount.com' },
    { key: 'private_key', label: 'Private Key', type: 'password', placeholder: 'Enter private key' }
  ];

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
          
          <TabsContent value="aws">
            {renderCredentialForm('aws', awsCredentials, setAwsCredentials, [
              ...awsFields,
              { buttonClass: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' }
            ])}
          </TabsContent>
          
          <TabsContent value="azure">
            {renderCredentialForm('azure', azureCredentials, setAzureCredentials, [
              ...azureFields,
              { buttonClass: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' }
            ])}
          </TabsContent>
          
          <TabsContent value="gcp">
            {renderCredentialForm('gcp', gcpCredentials, setGcpCredentials, [
              ...gcpFields,
              { buttonClass: 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600' }
            ])}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CloudProviderConfig;
