
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for small teams getting started with automated infrastructure",
      features: [
        "Up to 5 cloud resources",
        "Basic AI infrastructure generation",
        "AWS, Azure, or GCP support",
        "Standard deployment templates",
        "Email support",
        "Community access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$149",
      description: "Advanced features for growing teams with complex infrastructure needs",
      features: [
        "Unlimited cloud resources",
        "Advanced AI with custom models",
        "Multi-cloud orchestration",
        "Custom Pulumi templates",
        "Priority support",
        "Advanced monitoring",
        "Team collaboration tools",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$399",
      description: "Complete solution for large organizations with enterprise-grade requirements",
      features: [
        "Everything in Professional",
        "Dedicated AI model training",
        "Custom integrations",
        "Advanced security controls",
        "24/7 dedicated support",
        "On-premise deployment",
        "Custom SLA",
        "Training & onboarding"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 relative bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">
              • PRICING PLANS •
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Infrastructure Plan
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Scale your infrastructure automation with plans designed for every team size and complexity level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-cyan-400/50 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-300 text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-white font-semibold mb-4">What's included:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full py-3 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600' 
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  } transition-all duration-200`}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            All plans include a 14-day free trial. No credit card required to get started.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
