
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto text-center">
        <Badge className="mb-6 bg-blue-900/50 text-blue-200 border-blue-700">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Infrastructure
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
          Providing The Best
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Agentic AI Solutions
          </span>
        </h1>
        
        <p className="text-xl text-blue-200 mb-12 max-w-3xl mx-auto">
          Transform natural language into multi-cloud infrastructure with our advanced AI system. 
          Seamlessly integrate AWS Bedrock, Azure AI Services, and Google Vertex AI for intelligent IaC generation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Start Building
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-900/30">
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>
        
        {/* Hero Illustration */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-blue-700/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-blue-800/30">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">AWS</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Bedrock (Claude 3)</h3>
                <p className="text-blue-200 text-sm">Advanced prompt processing and natural language understanding</p>
              </div>
              
              <div className="bg-slate-900/50 rounded-xl p-6 border border-blue-800/30">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">AZ</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Azure OpenAI</h3>
                <p className="text-blue-200 text-sm">Intelligent orchestration and workflow automation</p>
              </div>
              
              <div className="bg-slate-900/50 rounded-xl p-6 border border-blue-800/30">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">GCP</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Vertex AI (Gemini)</h3>
                <p className="text-blue-200 text-sm">Advanced IaC generation and validation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
