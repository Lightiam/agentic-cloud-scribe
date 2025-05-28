
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: "🌐",
      title: "Multi-Cloud Deployment",
      description: "Deploy infrastructure across AWS, Azure, and GCP with unified commands and consistent management.",
      link: "Read More"
    },
    {
      icon: "🤖",
      title: "Agentic AI Processing",
      description: "Natural language to Infrastructure as Code conversion using advanced AI models and reasoning capabilities.",
      link: "Read More"
    },
    {
      icon: "📊",
      title: "Infrastructure Analytics",
      description: "Real-time monitoring, cost optimization, and performance insights across all your cloud resources.",
      link: "Read More"
    },
    {
      icon: "🔧",
      title: "Pulumi Integration",
      description: "Seamless integration with Pulumi for modern Infrastructure as Code generation and deployment.",
      link: "Read More"
    },
    {
      icon: "🔍",
      title: "Smart Validation",
      description: "AI-powered infrastructure validation and compliance checking before deployment execution.",
      link: "Read More"
    },
    {
      icon: "📈",
      title: "Cost Optimization",
      description: "Intelligent resource sizing, scheduling, and cost management across multiple cloud providers.",
      link: "Read More"
    }
  ];

  return (
    <section id="services" className="py-20 relative bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
          <div>
            <div className="inline-block mb-4">
              <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
                • SERVICES •
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Services We Offer
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl">
              Comprehensive AI-powered infrastructure solutions designed to accelerate your cloud journey 
              and optimize your multi-cloud operations.
            </p>
          </div>
          
          <Button 
            className="mt-6 lg:mt-0 bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 group"
          >
            See All Services
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Service Icon */}
              <div className="text-4xl mb-6">{service.icon}</div>
              
              {/* Service Content */}
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {service.description}
              </p>
              
              {/* Read More Link */}
              <button className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors group/link">
                {service.link}
                <ArrowRight className="inline ml-2 h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
              </button>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
