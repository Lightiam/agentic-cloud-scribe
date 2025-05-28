
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <Hero />
      <Services />
      <Features />
      <TechStack />
    </div>
  );
};

export default Index;
