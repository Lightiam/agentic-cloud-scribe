
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
    { name: "Home", href: "/", active: window.location.pathname === "/" },
    { name: "Dashboard", href: "/dashboard", active: window.location.pathname === "/dashboard", authRequired: true },
    { name: "Workspace", href: "/workspace", active: window.location.pathname === "/workspace", authRequired: true },
    { name: "Profile", href: "/profile", active: window.location.pathname === "/profile", authRequired: true },
    { name: "Pricing Plans", href: "/#pricing", active: false }
  ];

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      // Handle anchor links
      if (window.location.pathname !== '/') {
        window.location.href = href;
      } else {
        const element = document.querySelector(href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Handle regular navigation
      window.location.href = href;
    }
  };

  return (
    <>
      <nav className="relative z-50 bg-[#101323] border-b border-[#2f396a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#607afb] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">&lt;/&gt;</span>
                </div>
                <span className="text-white font-bold text-xl">Agentic Cloud</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems
                  .filter(item => !item.authRequired || isAuthenticated)
                  .map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.href)}
                      className={`${
                        item.active
                          ? "text-[#607afb] border-b-2 border-[#607afb]"
                          : "text-[#8e99cc] hover:text-white"
                      } px-3 py-2 text-sm font-medium transition-colors duration-200 border-none bg-transparent`}
                    >
                      {item.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Auth and Mobile menu */}
            <div className="flex items-center space-x-4">
              <button className="text-[#8e99cc] hover:text-white transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-[#607afb]" />
                    <span className="text-white text-sm hidden sm:block">{user?.username}</span>
                  </div>
                  <Button
                    onClick={logout}
                    variant="cloudSecondary"
                    className="hidden sm:block"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Button
                    onClick={() => handleAuthClick('login')}
                    variant="cloudSecondary"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('register')}
                    variant="cloud"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-[#8e99cc] hover:text-white"
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#181d35]">
              {navItems
                .filter(item => !item.authRequired || isAuthenticated)
                .map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`${
                      item.active
                        ? "text-[#607afb] bg-[#21284a]"
                        : "text-[#8e99cc] hover:text-white hover:bg-[#21284a]"
                    } block px-3 py-2 text-base font-medium transition-colors duration-200 w-full text-left border-none bg-transparent`}
                  >
                    {item.name}
                  </button>
                ))}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 px-3 pt-4">
                  <Button
                    onClick={() => handleAuthClick('login')}
                    variant="cloudSecondary"
                    className="justify-start"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('register')}
                    variant="cloud"
                    className="justify-start"
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
