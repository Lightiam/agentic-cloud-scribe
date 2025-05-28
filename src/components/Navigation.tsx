
import { useState } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { name: "Home", href: "#", active: true },
    { name: "Pricing Plans", href: "#pricing" }
  ];

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="relative z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">&lt;/&gt;</span>
                </div>
                <span className="text-white font-bold text-xl">Instatiate.dev</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.active
                        ? "text-cyan-400 border-b-2 border-cyan-400"
                        : "text-gray-300 hover:text-cyan-400"
                    } px-3 py-2 text-sm font-medium transition-colors duration-200`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Auth and Mobile menu */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-cyan-400" />
                    <span className="text-white text-sm hidden sm:block">{user?.username}</span>
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="text-gray-300 border-gray-600 hover:bg-slate-700 hidden sm:block"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Button
                    onClick={() => handleAuthClick('login')}
                    variant="ghost"
                    className="text-gray-300 hover:text-white"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('register')}
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-300 hover:text-white"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800/95 backdrop-blur-sm">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.active
                      ? "text-cyan-400 bg-slate-700"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-slate-700"
                  } block px-3 py-2 text-base font-medium transition-colors duration-200`}
                >
                  {item.name}
                </a>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 px-3 pt-4">
                  <Button
                    onClick={() => handleAuthClick('login')}
                    variant="ghost"
                    className="text-gray-300 hover:text-white justify-start"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('register')}
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 justify-start"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default Navigation;
