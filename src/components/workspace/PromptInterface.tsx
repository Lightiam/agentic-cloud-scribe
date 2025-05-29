
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Sparkles, Code, Globe, Database, Server, Cloud } from 'lucide-react';
import { deploymentsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface PromptInterfaceProps {
  conversationId: string | null;
}

const PromptInterface: React.FC<PromptInterfaceProps> = ({ conversationId }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const suggestions = [
    {
      title: 'Create a web server',
      description: 'Deploy a scalable web server with load balancer',
      icon: Server,
    },
    {
      title: 'Setup database cluster',
      description: 'Configure a high-availability database setup',
      icon: Database,
    },
    {
      title: 'Container orchestration',
      description: 'Deploy microservices with Kubernetes',
      icon: Cloud,
    },
    {
      title: 'API Gateway setup',
      description: 'Create an API gateway with authentication',
      icon: Globe,
    },
  ];

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    setPrompt(suggestion.description);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await deploymentsAPI.create({
        prompt,
        providers: ['aws'], // Default to AWS
        auto_terminate_hours: 24,
      });
      
      toast({
        title: "Deployment Started",
        description: `Infrastructure deployment initiated! ID: ${response.data.deployment_id}`,
      });
      
      setPrompt('');
    } catch (error: any) {
      toast({
        title: "Deployment Failed",
        description: error.response?.data?.detail || "Failed to start deployment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#101323]">
      {/* Header */}
      <div className="p-6 border-b border-[#21284a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#607afb] rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Cloud Deploy</h1>
            <p className="text-[#8e99cc] text-sm">Describe your infrastructure needs</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {!conversationId ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#607afb] rounded-xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                How can I help you today?
              </h2>
              <p className="text-[#8e99cc] mb-8">
                Describe the infrastructure you want to deploy and I'll help you set it up
              </p>

              {/* Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {suggestions.map((suggestion, index) => (
                  <Card 
                    key={index}
                    className="p-4 bg-[#181d35] border border-[#2f396a] hover:bg-[#21284a] cursor-pointer transition-colors rounded-xl"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center rounded-lg bg-[#21284a] shrink-0 size-12">
                        <suggestion.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-medium">{suggestion.title}</h3>
                        <p className="text-[#8e99cc] text-sm">{suggestion.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#181d35] rounded-xl p-4 border border-[#2f396a]">
                <p className="text-white">Previous conversation content would appear here...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-[#21284a]">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your infrastructure deployment..."
              className="w-full bg-[#181d35] border border-[#2f396a] rounded-xl px-4 py-3 pr-12 text-white placeholder-[#8e99cc] focus:outline-none focus:ring-2 focus:ring-[#607afb] resize-none min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
              className="absolute bottom-3 right-3 bg-[#607afb] hover:bg-[#4a62d3] rounded-xl p-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-[#8e99cc] mt-2">
            Press Enter to deploy or Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptInterface;
