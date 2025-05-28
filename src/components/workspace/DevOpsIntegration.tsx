
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, GitBranch, Webhook, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DevOpsIntegration: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();

  const apiBaseUrl = 'https://your-storm-api.com'; // Replace with actual API URL

  const integrationExamples = {
    github: `name: Deploy Infrastructure
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Infrastructure
        run: |
          curl -X POST "${apiBaseUrl}/deployments" \\
            -H "Authorization: Bearer \${{ secrets.STORM_API_TOKEN }}" \\
            -H "Content-Type: application/json" \\
            -d '{
              "prompt": "Deploy production web application",
              "providers": ["aws"],
              "environment": "prod"
            }'`,
    
    jenkins: `pipeline {
    agent any
    
    stages {
        stage('Deploy Infrastructure') {
            steps {
                script {
                    def response = sh(
                        script: """
                            curl -X POST "${apiBaseUrl}/deployments" \\
                                -H "Authorization: Bearer \${env.STORM_API_TOKEN}" \\
                                -H "Content-Type: application/json" \\
                                -d '{
                                    "prompt": "Deploy staging environment",
                                    "providers": ["aws", "azure"],
                                    "environment": "staging"
                                }'
                        """,
                        returnStdout: true
                    )
                    echo response
                }
            }
        }
    }
}`,
    
    terraform: `# terraform/main.tf
terraform {
  required_providers {
    http = {
      source = "hashicorp/http"
    }
  }
}

resource "null_resource" "storm_deployment" {
  provisioner "local-exec" {
    command = <<-EOT
      curl -X POST "${apiBaseUrl}/deployments" \\
        -H "Authorization: Bearer \${var.storm_api_token}" \\
        -H "Content-Type: application/json" \\
        -d '{
          "prompt": "\${var.infrastructure_description}",
          "providers": \${jsonencode(var.cloud_providers)},
          "environment": "\${var.environment}"
        }'
    EOT
  }
}

variable "storm_api_token" {
  description = "Storm Platform API Token"
  type        = string
  sensitive   = true
}

variable "infrastructure_description" {
  description = "Infrastructure requirements"
  type        = string
}

variable "cloud_providers" {
  description = "List of cloud providers"
  type        = list(string)
  default     = ["aws"]
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}`,
    
    gitlab: `deploy_infrastructure:
  stage: deploy
  script:
    - |
      curl -X POST "${apiBaseUrl}/deployments" \\
        -H "Authorization: Bearer \$STORM_API_TOKEN" \\
        -H "Content-Type: application/json" \\
        -d '{
          "prompt": "Deploy microservices architecture",
          "providers": ["gcp"],
          "environment": "prod",
          "auto_terminate_hours": 72
        }'
  only:
    - main
  variables:
    STORM_API_TOKEN: \$STORM_API_TOKEN`
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} configuration copied to clipboard`,
    });
  };

  const webhookEndpoints = [
    {
      method: 'POST',
      endpoint: '/webhooks/deployment-status',
      description: 'Deployment status updates',
      payload: {
        deployment_id: 'string',
        status: 'running | completed | failed',
        cost: 'number',
        resources: 'object'
      }
    },
    {
      method: 'POST', 
      endpoint: '/webhooks/cost-alert',
      description: 'Cost threshold alerts',
      payload: {
        deployment_id: 'string',
        current_cost: 'number',
        threshold: 'number',
        alert_type: 'warning | critical'
      }
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            DevOps Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ci-cd" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="ci-cd" className="text-white">CI/CD</TabsTrigger>
              <TabsTrigger value="webhooks" className="text-white">Webhooks</TabsTrigger>
              <TabsTrigger value="api" className="text-white">API</TabsTrigger>
            </TabsList>

            <TabsContent value="ci-cd" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(integrationExamples).map(([platform, config]) => (
                  <Card key={platform} className="bg-slate-700/50 border-slate-600">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-white capitalize flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          {platform}
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(config, platform)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <pre className="text-xs text-gray-300 bg-slate-800 p-3 rounded overflow-x-auto max-h-48">
                        {config}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Webhook URL</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://your-app.com/webhooks/storm"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button variant="outline" className="border-slate-600 text-gray-300">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium">Available Webhook Endpoints</h4>
                  {webhookEndpoints.map((webhook, index) => (
                    <Card key={index} className="bg-slate-700/30 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {webhook.method}
                          </Badge>
                          <code className="text-cyan-400 text-sm">{webhook.endpoint}</code>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{webhook.description}</p>
                        <pre className="text-xs text-gray-400 bg-slate-800 p-2 rounded">
                          {JSON.stringify(webhook.payload, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">API Base URL</h4>
                  <div className="flex items-center gap-2">
                    <code className="text-cyan-400 bg-slate-800 px-2 py-1 rounded">{apiBaseUrl}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(apiBaseUrl, 'API URL')}
                      className="text-cyan-400"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { method: 'POST', endpoint: '/deployments', description: 'Create new deployment' },
                    { method: 'GET', endpoint: '/deployments', description: 'List all deployments' },
                    { method: 'GET', endpoint: '/deployments/{id}', description: 'Get deployment details' },
                    { method: 'DELETE', endpoint: '/deployments/{id}', description: 'Terminate deployment' },
                    { method: 'GET', endpoint: '/dashboard/stats', description: 'Get dashboard statistics' },
                  ].map((api, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {api.method}
                        </Badge>
                        <code className="text-cyan-400 text-sm">{api.endpoint}</code>
                      </div>
                      <span className="text-gray-300 text-sm">{api.description}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-300 font-medium">Authentication Required</span>
                  </div>
                  <p className="text-yellow-300 text-sm">
                    All API requests require a Bearer token in the Authorization header. 
                    Get your API token from the profile settings.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevOpsIntegration;
