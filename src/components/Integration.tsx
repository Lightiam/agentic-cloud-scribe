
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plug, Shield, Eye, Database } from "lucide-react";

const Integration = () => {
  const integrations = [
    {
      icon: <Plug className="w-6 h-6" />,
      name: "Pulumi AI",
      description: "Cross-cloud IaC template generation",
      category: "Infrastructure"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      name: "Paragon",
      description: "Unified API for 3rd-party authentication",
      category: "Security"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      name: "Torque",
      description: "IaC validation and governance",
      category: "Validation"
    },
    {
      icon: <Database className="w-6 h-6" />,
      name: "OpenTelemetry",
      description: "Monitoring agent decisions",
      category: "Observability"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      name: "HashiCorp Vault",
      description: "Secret management for credentials",
      category: "Security"
    }
  ];

  return (
    <section id="integrations" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-900/50 text-green-200 border-green-700">
            INTEGRATIONS
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Third-Party Integrations
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Seamlessly connect with industry-leading tools and services for complete infrastructure automation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <Card key={index} className="bg-slate-800/50 border-blue-800/30 hover:border-blue-600/50 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="text-blue-400">
                      {integration.icon}
                    </div>
                  </div>
                  <Badge className="bg-blue-900/50 text-blue-200 border-blue-700 text-xs">
                    {integration.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white text-lg mb-2">{integration.name}</CardTitle>
                <p className="text-blue-200 text-sm mb-4">{integration.description}</p>
                <Button variant="link" className="text-cyan-400 hover:text-cyan-300 p-0 text-sm">
                  Learn More
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Implementation Steps */}
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Implementation Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  1
                </div>
                <h3 className="text-white font-semibold mb-2">Set Up Models</h3>
                <p className="text-blue-200 text-sm">Configure AWS Bedrock, Azure AI, and GCP Vertex AI access</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  2
                </div>
                <h3 className="text-white font-semibold mb-2">Create Actions</h3>
                <p className="text-blue-200 text-sm">Build action groups for Pulumi code generation and validation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  3
                </div>
                <h3 className="text-white font-semibold mb-2">Security Controls</h3>
                <p className="text-blue-200 text-sm">Implement OAuth 2.0 and vault integration for secure access</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  4
                </div>
                <h3 className="text-white font-semibold mb-2">Deploy & Monitor</h3>
                <p className="text-blue-200 text-sm">Launch with comprehensive monitoring and audit capabilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Integration;
