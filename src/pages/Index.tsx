
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Cloud, Cpu, Shield, Zap, Terminal, Bot, GitBranch } from "lucide-react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Architecture from "@/components/Architecture";
import Integration from "@/components/Integration";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      <Hero />
      <Features />
      <Architecture />
      <Integration />
      
      {/* Footer */}
      <footer className="border-t border-blue-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Infrastructure?</h3>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
              Join the future of cloud provisioning with AI-powered infrastructure automation
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Building
            </Button>
          </div>
          <div className="mt-12 pt-8 border-t border-blue-800/30 text-center text-blue-300">
            <p>&copy; 2024 Instatiate.dev. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
