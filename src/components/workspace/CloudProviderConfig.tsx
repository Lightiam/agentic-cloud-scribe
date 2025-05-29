import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Key, FileText, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CloudProvider {
  id: string;
  provider_name: string;
  credentials: Record<string, any>;
  is_active: boolean;
}

const CloudProviderConfig = () => {
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<'manual' | 'json'>('manual');
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [keyValuePairs, setKeyValuePairs] = useState<{key: string, value: string}[]>([
    { key: '', value: '' }
  ]);
  const { toast } = useToast();

  const providerFields = {
    aws: [
      { name: 'access_key_id', label: 'Access Key ID', type: 'text', required: true },
      { name: 'secret_access_key', label: 'Secret Access Key', type: 'password', required: true },
      { name: 'region', label: 'Default Region', type: 'text', required: true }
    ],
    azure: [
      { name: 'client_id', label: 'Client ID', type: 'text', required: true },
      { name: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { name: 'tenant_id', label: 'Tenant ID', type: 'text', required: true },
      { name: 'subscription_id', label: 'Subscription ID', type: 'text', required: true }
    ],
    gcp: [
      { name: 'project_id', label: 'Project ID', type: 'text', required: true },
      { name: 'private_key_id', label: 'Private Key ID', type: 'text', required: true },
      { name: 'private_key', label: 'Private Key', type: 'textarea', required: true },
      { name: 'client_email', label: 'Client Email', type: 'email', required: true },
      { name: 'client_id', label: 'Client ID', type: 'text', required: true }
    ]
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setJsonFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target?.result as string);
          setCredentials(jsonContent);
          toast({
            title: "JSON file loaded",
            description: "Credentials have been parsed from the JSON file.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid JSON file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid JSON file.",
        variant: "destructive",
      });
    }
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  };

  const removeKeyValuePair = (index: number) => {
    setKeyValuePairs(keyValuePairs.filter((_, i) => i !== index));
  };

  const updateKeyValuePair = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...keyValuePairs];
    updated[index][field] = value;
    setKeyValuePairs(updated);
  };

  const renderManualInputs = () => {
    if (!selectedProvider) return null;

    const fields = providerFields[selectedProvider as keyof typeof providerFields] || [];

    return (
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                value={credentials[field.name] || ''}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  [field.name]: e.target.value
                }))}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="min-h-20"
              />
            ) : (
              <Input
                id={field.name}
                type={field.type}
                value={credentials[field.name] || ''}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  [field.name]: e.target.value
                }))}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        ))}
        
        <div className="mt-6">
          <Label className="text-base font-medium">Additional Credentials</Label>
          <p className="text-sm text-muted-foreground mb-3">Add any additional key-value pairs needed</p>
          {keyValuePairs.map((pair, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                placeholder="Key"
                value={pair.key}
                onChange={(e) => updateKeyValuePair(index, 'key', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value"
                value={pair.value}
                onChange={(e) => updateKeyValuePair(index, 'value', e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeKeyValuePair(index)}
                disabled={keyValuePairs.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addKeyValuePair}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>
    );
  };

  const renderJsonUpload = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Label htmlFor="json-upload" className="cursor-pointer">
            <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Upload JSON credentials file
            </span>
            <Input
              id="json-upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </Label>
          <p className="text-xs text-gray-500 mt-1">
            Or drag and drop a JSON file here
          </p>
        </div>
      </div>

      {jsonFile && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-800">
            ✓ Loaded: {jsonFile.name}
          </p>
        </div>
      )}

      {Object.keys(credentials).length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Parsed Credentials:</Label>
          <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-700">
              {JSON.stringify(credentials, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  const handleSubmit = async () => {
    if (!selectedProvider) {
      toast({
        title: "Error",
        description: "Please select a cloud provider.",
        variant: "destructive",
      });
      return;
    }

    let finalCredentials = { ...credentials };

    if (inputMethod === 'manual') {
      keyValuePairs.forEach(pair => {
        if (pair.key && pair.value) {
          finalCredentials[pair.key] = pair.value;
        }
      });
    }

    try {
      // API call to save provider configuration
      console.log('Saving provider config:', {
        provider_name: selectedProvider,
        credentials: finalCredentials
      });

      toast({
        title: "Success",
        description: "Cloud provider configuration saved successfully.",
      });

      // Reset form
      setCredentials({});
      setKeyValuePairs([{ key: '', value: '' }]);
      setJsonFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save cloud provider configuration.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Cloud Provider Configuration
        </CardTitle>
        <CardDescription>
          Configure your cloud provider credentials to enable infrastructure deployment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Cloud Provider</Label>
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a cloud provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
              <SelectItem value="azure">Microsoft Azure</SelectItem>
              <SelectItem value="gcp">Google Cloud Platform (GCP)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedProvider && (
          <>
            <div className="flex items-center space-x-2">
              <Switch
                checked={inputMethod === 'json'}
                onCheckedChange={(checked) => setInputMethod(checked ? 'json' : 'manual')}
              />
              <Label className="text-sm">Use JSON file upload</Label>
            </div>

            <Tabs value={inputMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Manual Input
                </TabsTrigger>
                <TabsTrigger value="json" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  JSON Upload
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="mt-4">
                {renderManualInputs()}
              </TabsContent>
              
              <TabsContent value="json" className="mt-4">
                {renderJsonUpload()}
              </TabsContent>
            </Tabs>

            <Button onClick={handleSubmit} className="w-full">
              Save Configuration
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CloudProviderConfig;
