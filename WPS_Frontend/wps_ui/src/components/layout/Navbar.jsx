import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-primary">
              WebPulse Stack
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </a>
            <Link to={"/dashboard"}>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About Us
            </a>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to={"/login"}>
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to={"/register"}>
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3">
            <a href="#" className="block py-2 text-muted-foreground hover:text-primary">
              Home
            </a>
            <a href="#" className="block py-2 text-muted-foreground hover:text-primary">
              Features
            </a>
            <a href="#" className="block py-2 text-muted-foreground hover:text-primary">
              Pricing
            </a>
            <a href="#" className="block py-2 text-muted-foreground hover:text-primary">
              Documentation
            </a>
            <a href="#" className="block py-2 text-muted-foreground hover:text-primary">
              About Us
            </a>
            <div className="pt-3 flex space-x-3">
              <Link to={"/login"}>
                <Button variant="outline" size="sm" className="w-full">Login</Button>
              </Link>
              <Link to={"/register"}>
                <Button size="sm" className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;