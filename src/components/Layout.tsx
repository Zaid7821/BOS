import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import schoolLogo from "@/assets/school-logo.jpg";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/academics", label: "Academics" },
    { to: "/admissions", label: "Admissions" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-school-sm">
        <div className="container mx-auto px-4">
          {/* Top contact bar */}
          <div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground border-b border-border/50">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 9565313000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@bosfatehpur.in" className="hover:underline">
                  info@bosfatehpur.in
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Pakka Talab Fatehpur, UP</span>
            </div>
          </div>

          {/* Main navigation */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <img
                src={schoolLogo}
                alt="Brilliant Oriental School Logo"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-primary">
                  Brilliant Oriental School
                </h1>
                <p className="text-sm text-muted-foreground">Excellence in Education</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-primary ${isActive
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden pb-4 border-t border-border/50 mt-4 pt-4">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded ${isActive ? "text-primary bg-primary-lighter" : "text-foreground"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Button variant="hero" size="sm" className="self-start">
                  Apply Now
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* School Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                {/* 🔥 Updated logo styling here */}
                <div className="h-10 w-10 rounded bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={schoolLogo}
                    alt="Brilliant Oriental School Logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold">Brilliant Oriental School</h3>
              </div>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Nurturing minds, building futures. Excellence in education since 2006.
              </p>
              <div className="space-y-2 text-sm text-primary-foreground/80">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Pakka Talab, Fatehpur UP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 9565313000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href="mailto:info@bosfatehpur.in"
                    className="hover:underline"
                  >
                    info@bosfatehpur.in
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {navItems.slice(0, 4).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Academics */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Academics</h4>
              <div className="space-y-2 text-sm text-primary-foreground/80">
                <p>Primary School (K-5)</p>
                <p>Middle School (6-8)</p>
                <p>High School (9-12)</p>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() =>
                    window.open("https://www.facebook.com/bosfatehpur/", "_blank")
                  }
                >
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/@Brilliant_Oriental_School",
                      "_blank",
                    )
                  }
                >
                  Youtube
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/bos_officialaccount?igsh=ZjRnb3BreHJjN3h0",
                      "_blank",
                    )
                  }
                >
                  Instagram
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
            <p>&copy; 2025 Brilliant Oriental School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
