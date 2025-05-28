
import { Button } from "@/components/ui/button";
import { Code, Menu } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-blue-800/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Instatiate.dev</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-blue-200 hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="text-blue-200 hover:text-white transition-colors">Architecture</a>
            <a href="#integrations" className="text-blue-200 hover:text-white transition-colors">Integrations</a>
            <a href="#docs" className="text-blue-200 hover:text-white transition-colors">Docs</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-blue-200 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
