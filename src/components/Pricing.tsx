
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PricingTier {
  name: string;
  price: number;
  features: string[];
  max_deployments: number;
  max_concurrent_instances: number;
  support_level: string;
}

const Pricing = () => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPricingTiers();
  }, []);

  const fetchPricingTiers = async () => {
    try {
      const response = await pricingAPI.getTiers();
      setTiers(response.data);
    } catch (error) {
      console.error('Failed to fetch pricing tiers:', error);
      toast({
        title: "Error",
        description: "Failed to load pricing information",
        variant: "destructive",
      });
      // Fallback to default pricing if API fails
      setTiers([
        {
          name: "Basic",
          price: 44,
          features: ["Up to 5 deployments", "Email support", "Basic monitoring", "1 concurrent instance"],
          max_deployments: 5,
          max_concurrent_instances: 1,
          support_level: "email"
        },
        {
          name: "Professional", 
          price: 74,
          features: ["Up to 25 deployments", "Priority support", "Advanced monitoring", "5 concurrent instances", "Multi-cloud", "Auto-scaling"],
          max_deployments: 25,
          max_concurrent_instances: 5,
          support_level: "priority"
        },
        {
          name: "Enterprise",
          price: 94,
          features: ["Unlimited deployments", "24/7 phone support", "Custom integrations", "Unlimited concurrent instances", "Dedicated account manager", "SLA guarantee"],
          max_deployments: -1,
          max_concurrent_instances: -1,
          support_level: "phone"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (tierName: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan",
      });
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: `Subscription to ${tierName} plan will be available soon!`,
    });
  };

  if (loading) {
    return (
      <section id="pricing" className="py-20 relative bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white">Loading pricing information...</p>
          </div>
        </div>
      </section>
    );
  }

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
          {tiers.map((tier, index) => {
            const isPopular = tier.name === "Professional";
            return (
              <Card 
                key={index}
                className={`relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300 ${
                  isPopular ? 'ring-2 ring-cyan-400/50 scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-white mb-2">{tier.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>Max deployments: {tier.max_deployments === -1 ? 'Unlimited' : tier.max_deployments}</p>
                    <p>Concurrent instances: {tier.max_concurrent_instances === -1 ? 'Unlimited' : tier.max_concurrent_instances}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold mb-4">What's included:</h4>
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => handleSubscribe(tier.name)}
                    className={`w-full py-3 ${
                      isPopular 
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600' 
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    } transition-all duration-200`}
                  >
                    {isAuthenticated ? 'Subscribe Now' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
