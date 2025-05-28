
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Database, GitBranch, Lock } from "lucide-react";

const Architecture = () => {
  const layers = [
    {
      title: "Prompt Processing Layer",
      description: "Advanced NLP models for understanding natural language infrastructure requirements",
      services: ["AWS Bedrock (Claude 3)", "Azure OpenAI Service", "Google Vertex AI (Gemini)"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Orchestration Layer", 
      description: "Intelligent workflow management and decision orchestration across cloud providers",
      services: ["AWS Step Functions", "Azure Logic Apps", "GCP Workflows"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "IaC Generation Layer",
      description: "Cross-cloud Infrastructure as Code generation with validation and optimization",
      services: ["Pulumi AWS", "Pulumi Azure", "Pulumi GCP"],
      color: "from-green-500 to-blue-500"
    },
    {
      title: "Security & Governance",
      description: "Enterprise-grade security controls and compliance management",
      services: ["IAM + KMS", "Entra ID + Key Vault", "IAM + Cloud KMS"],
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="architecture" className="py-20 px-6 bg-slate-900/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-900/50 text-purple-200 border-purple-700">
            ARCHITECTURE
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Multi-Cloud AI Architecture
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            A sophisticated four-layer architecture designed for enterprise-scale infrastructure automation
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {layers.map((layer, index) => (
            <Card key={index} className="bg-slate-800/50 border-blue-800/30 hover:border-blue-600/50 transition-all duration-300">
              <CardHeader>
                <div className={`w-full h-2 bg-gradient-to-r ${layer.color} rounded-full mb-4`}></div>
                <CardTitle className="text-white text-xl">{layer.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 mb-6">{layer.description}</p>
                <div className="space-y-3">
                  {layer.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 bg-gradient-to-r ${layer.color} rounded-full`}></div>
                      <span className="text-blue-100">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Code Example */}
        <div className="mt-16">
          <Card className="bg-slate-900/80 border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <GitBranch className="w-5 h-5 mr-2 text-green-400" />
                Implementation Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-950/50 rounded-lg p-6 overflow-x-auto">
                <pre className="text-green-300 text-sm">
{`# Core agent logic using Claude 3 via Bedrock
import boto3

bedrock = boto3.client('bedrock-runtime')

def generate_iac(prompt: str):
    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        body=json.dumps({
            "messages": [{
                "role": "user", 
                "content": f"Convert to Pulumi code: {prompt}"
            }],
            "temperature": 0.5
        })
    )
    return json.loads(response['body'].read())['content']`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
