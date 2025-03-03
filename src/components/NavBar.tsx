/*COMPOSANT BAR DE NAVIGATION*/
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full border-b border-primary/20 bg-[#020817]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/IYFFA-logo.svg" alt="Logo" className="h-12 w-12" />
          <span className="text-xl font-bold text-white">IYFFA</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-2 text-md">
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/events">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Events
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/articles">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Articles
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Get Involved</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px] bg-[#020817] border border-primary/20">
                  <Link to="/donations" className="block p-2 hover:bg-white/20 rounded-md">
                    <div className="text-md font-medium text-[#1EAEDB] mb-1">Donations</div>
                    <p className="text-sm text-white">Support our youth initiatives and community projects</p>
                  </Link>
                  <Link to="/membership" className="block p-2 hover:bg-white/20 rounded-md">
                    <div className="text-md font-medium text-[#1EAEDB] mb-1">Become a Member</div>
                    <p className="text-sm text-white">Join our community of young changemakers</p>
                  </Link>
                  <Link to="/about#contact" className="block p-2 hover:bg-white/20 rounded-md">
                    <div className="text-md font-medium text-[#1EAEDB] mb-1">About us</div>
                    <p className="text-sm text-white">Get to know our objectives and team</p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <Link to="/signin" className="hidden md:flex">
          <Button variant="outline" className="gap-2 border-white text-white hover:bg-white/20">
            <User className="h-4 w-4" />
            <span>Sign In</span>
          </Button>
        </Link>
      </div>

      <div
        className={`z-50 fixed top-16 right-0 w-full h-screen bg-[#020817] shadow-lg md:hidden
        transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-2 p-4">
          <Link to="/" className="text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/events" className="text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
          <Link to="/articles" className="text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Articles</Link>
          <Link to="/donations" className="text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Donations</Link>
          <Link to="/membership" className="text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Become a Member</Link>
          <Link to="/about#contact" className="text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link to="/signin" className="flex justify-center mt-4" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" className="w-2/7 border-white text-white hover:bg-white/20">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
