
const Features = () => {
  const features = [
    {
      title: "Natural Language Processing",
      description: "Convert plain English commands into sophisticated Infrastructure as Code templates",
      gradient: "from-cyan-400 to-blue-500"
    },
    {
      title: "Multi-Cloud Support", 
      description: "Deploy seamlessly across AWS, Azure, and Google Cloud Platform with unified management",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      title: "AI-Powered Validation",
      description: "Intelligent pre-deployment validation and security compliance checking",
      gradient: "from-green-400 to-teal-500"
    },
    {
      title: "Cost Optimization",
      description: "Automated resource sizing and cost management across all cloud providers",
      gradient: "from-orange-400 to-red-500"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
              • FEATURES •
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful AI-Driven Features
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Experience the future of infrastructure management with our cutting-edge AI capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-400/30 transition-all duration-300"
            >
              {/* Feature Number */}
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                <span className="text-white font-bold text-lg">{String(index + 1).padStart(2, '0')}</span>
              </div>
              
              {/* Feature Content */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
