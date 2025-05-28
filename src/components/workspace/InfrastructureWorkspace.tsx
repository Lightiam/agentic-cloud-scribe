
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Rocket, Settings, GitBranch } from 'lucide-react';
import DeploymentInterface from './DeploymentInterface';
import CloudProviderConfig from './CloudProviderConfig';
import DevOpsIntegration from './DevOpsIntegration';

const InfrastructureWorkspace: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Infrastructure as Code</h1>
        <p className="text-gray-400">Deploy and manage cloud infrastructure with natural language</p>
      </div>

      <Tabs defaultValue="deploy" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
          <TabsTrigger 
            value="deploy" 
            className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-blue-500"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Deploy
          </TabsTrigger>
          <TabsTrigger 
            value="providers" 
            className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-blue-500"
          >
            <Cloud className="h-4 w-4 mr-2" />
            Providers
          </TabsTrigger>
          <TabsTrigger 
            value="devops" 
            className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-blue-500"
          >
            <GitBranch className="h-4 w-4 mr-2" />
            DevOps
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="deploy">
            <DeploymentInterface />
          </TabsContent>

          <TabsContent value="providers">
            <CloudProviderConfig />
          </TabsContent>

          <TabsContent value="devops">
            <DevOpsIntegration />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default InfrastructureWorkspace;
