/*COMPOSANT BAR DE NAVIGATION*/
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Menu, X, LogOut, Plus } from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

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
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/events">Events</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/articles">Articles</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/projects">Projects</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/donations">Donations</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name} {user.surname}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                {isAdmin() && (
                  <DropdownMenuItem asChild>
                    <Link to="/users">User Management</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/signin">
              <Button variant="outline" className="border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white">
                Sign In
              </Button>
            </Link>
          )}
        </div>
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
          {user && (
            <Link to="/projects" className="text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Projects</Link>
          )}
          <Link to="/donations" className="text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>Donations</Link>
          <Link to="/about#contact" className="text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          {user ? (
            <div className="flex flex-col gap-2 mt-4">
              <div className="text-[#1EAEDB] py-2">{user.name} {user.surname}</div>
              <div className="text-[#1EAEDB] opacity-75 py-2">{user.email}</div>
              <Link to="/dashboard" className="text-[#1EAEDB] py-2 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-4 w-4 inline-block mr-2" />
                Dashboard
              </Link>
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
