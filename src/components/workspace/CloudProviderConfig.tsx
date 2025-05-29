
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProviderSelector from './cloudProvider/ProviderSelector';
import ManualInputForm from './cloudProvider/ManualInputForm';
import JsonUploadForm from './cloudProvider/JsonUploadForm';
import InputMethodToggle from './cloudProvider/InputMethodToggle';

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
        <ProviderSelector
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
        />

        {selectedProvider && (
          <>
            <InputMethodToggle
              inputMethod={inputMethod}
              onInputMethodChange={setInputMethod}
            />

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
                <ManualInputForm
                  selectedProvider={selectedProvider}
                  credentials={credentials}
                  keyValuePairs={keyValuePairs}
                  onCredentialsChange={setCredentials}
                  onKeyValuePairsChange={setKeyValuePairs}
                />
              </TabsContent>
              
              <TabsContent value="json" className="mt-4">
                <JsonUploadForm
                  jsonFile={jsonFile}
                  credentials={credentials}
                  onFileUpload={setJsonFile}
                  onCredentialsChange={setCredentials}
                />
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
