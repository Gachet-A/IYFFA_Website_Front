/*COMPOSANT BAR DE NAVIGATION*/
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Menu, X, LogOut } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

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

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white">
                <User className="h-4 w-4" />
                <span>{user.name} {user.surname}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1A1F2C] border-[#1EAEDB]">
              <DropdownMenuItem className="text-[#1EAEDB] cursor-default">
                <span className="opacity-75">{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/signin" className="hidden md:flex">
            <Button variant="outline" className="gap-2 border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </Link>
        )}
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
          {user ? (
            <div className="flex flex-col gap-2 mt-4">
              <div className="text-[#1EAEDB] py-2">{user.name} {user.surname}</div>
              <div className="text-[#1EAEDB] opacity-75 py-2">{user.email}</div>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 text-[#1EAEDB] py-2 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/signin" className="flex justify-center mt-4" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-2/7 border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white">
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
