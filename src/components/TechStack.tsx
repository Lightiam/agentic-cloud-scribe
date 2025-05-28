
const TechStack = () => {
  const technologies = [
    {
      category: "AI Models",
      items: [
        { name: "AWS Bedrock (Claude 3)", logo: "🤖" },
        { name: "Azure OpenAI Service", logo: "🧠" },
        { name: "Google Vertex AI", logo: "✨" }
      ]
    },
    {
      category: "Infrastructure as Code",
      items: [
        { name: "Pulumi", logo: "⚡" },
        { name: "Terraform", logo: "🏗️" },
        { name: "CloudFormation", logo: "☁️" }
      ]
    },
    {
      category: "Cloud Providers",
      items: [
        { name: "AWS", logo: "🟠" },
        { name: "Azure", logo: "🔵" },
        { name: "Google Cloud", logo: "🟢" }
      ]
    },
    {
      category: "Security & Monitoring",
      items: [
        { name: "HashiCorp Vault", logo: "🔐" },
        { name: "OpenTelemetry", logo: "📊" },
        { name: "CloudTrail", logo: "🔍" }
      ]
    }
  ];

  return (
    <section className="py-20 relative bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
              • TECHNOLOGY STACK •
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built on Industry-Leading Technologies
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Our platform leverages the most advanced AI models and cloud technologies to deliver unparalleled infrastructure automation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-white mb-6 text-center">{tech.category}</h3>
              
              <div className="space-y-4">
                {tech.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="text-2xl">{item.logo}</span>
                    <span className="text-gray-300 font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
