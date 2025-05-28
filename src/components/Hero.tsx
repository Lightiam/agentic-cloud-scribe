
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.3),transparent_50%)]"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4">
              <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
                • AI SOLUTIONS •
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Providing The Best
              <br />
              Services & AI{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Solutions
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
              Revolutionize your infrastructure with our agentic AI system. Deploy multi-cloud resources 
              using natural language commands and automated Infrastructure as Code generation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 px-8 py-3"
              >
                Start Now
              </Button>
              
              <Button 
                size="lg" 
                variant="ghost" 
                className="text-white hover:text-cyan-400 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-cyan-400/30 transition-colors">
                  <ArrowRight className="h-6 w-6 text-cyan-400" />
                </div>
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="relative mx-auto max-w-lg">
              {/* Main illustration container */}
              <div className="relative bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/30">
                {/* Lightbulb concept */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <span className="text-white text-3xl font-bold">&lt;/&gt;</span>
                  </div>
                  <div className="text-white font-semibold">AI-Powered IaC</div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center transform rotate-12 animate-bounce">
                  <span className="text-white font-bold">AWS</span>
                </div>
                
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center transform -rotate-12 animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <span className="text-white font-bold">GCP</span>
                </div>
                
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
                  <span className="text-white font-bold">Azure</span>
                </div>

                {/* Connection lines */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-cyan-400/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '20s' }}></div>
                  <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-purple-400/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                </div>
              </div>

              {/* Floating icons */}
              <div className="absolute -z-10 inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-8 h-8 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-lg transform rotate-45"
                    style={{
                      left: `${10 + (i % 3) * 30}%`,
                      top: `${10 + Math.floor(i / 3) * 25}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
