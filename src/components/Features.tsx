
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Cloud, Code, Shield, Zap, Terminal, ArrowRight } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Natural Language to IaC",
      description: "Convert plain English descriptions into production-ready Pulumi code across AWS, Azure, and GCP",
      badge: "AI-Powered"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Multi-Cloud Orchestration",
      description: "Seamlessly provision and manage infrastructure across multiple cloud providers with unified APIs",
      badge: "Cross-Platform"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security-First Design",
      description: "Built-in security controls with OAuth 2.0, HashiCorp Vault integration, and cloud-native RBAC",
      badge: "Enterprise-Ready"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Intelligent Validation",
      description: "AI-powered code validation and cost optimization with automated testing and preview capabilities",
      badge: "Smart"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Monitoring",
      description: "Complete observability with OpenTelemetry integration and comprehensive audit trails",
      badge: "Observable"
    },
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "CLI & API Access",
      description: "Powerful command-line interface and RESTful APIs for seamless developer workflow integration",
      badge: "Developer-Friendly"
    }
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-900/50 text-blue-200 border-blue-700">
            SERVICES
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Services We Offer
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Comprehensive AI-driven infrastructure automation with enterprise-grade security and multi-cloud support
          </p>
          <Button className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            See All Services
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-blue-800/30 hover:border-blue-600/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-blue-400">
                    {feature.icon}
                  </div>
                </div>
                <Badge className="w-fit mb-2 bg-blue-900/50 text-blue-200 border-blue-700">
                  {feature.badge}
                </Badge>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-200 mb-4">
                  {feature.description}
                </CardDescription>
                <Button variant="link" className="text-cyan-400 hover:text-cyan-300 p-0">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
