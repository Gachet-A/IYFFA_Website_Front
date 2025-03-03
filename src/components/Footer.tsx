/*PIED DE PAGE*/
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { useState } from "react";
import { isValidEmail } from "@/lib/validation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faInstagram, 
  faFacebookF, 
  faTwitter, 
  faTiktok, 
  faXTwitter
} from "@fortawesome/free-brands-svg-icons";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    // Email is valid, clear error and proceed
    setEmailError("");
    
    // Show success toast
    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to our newsletter.",
      variant: "default",
    });
    
    // Reset the email field
    setEmail("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (emailError) setEmailError("");
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  return (
    <footer className="bg-[#1A1F2C] text-white py-16 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-[#1EAEDB]">About IYFFA</h3>
          <p className="text-white mb-6">
            The International Youth Future Founders Association (IYFFA) is a youth-led
            non-profit organization committed to empowering young people through
            leadership development, social innovation, and community engagement.
          </p>
          <div className="space-y-2 text-white">
            <p>Email: contact@iyffa.org</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Innovation Street, Digital City</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-4 text-[#1EAEDB]">Stay Updated</h3>
          <p className="text-white mb-6">
            Subscribe to our newsletter for the latest youth initiatives, community
            projects, and opportunities to get involved.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-[#222222] border-[#1EAEDB] text-white placeholder:text-gray-400"
                required
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-[#1EAEDB] text-white hover:bg-[#1EAEDB]/90">
              Subscribe to Newsletter
            </Button>
          </form>
          
          {/* Social Media Links */}
          <div className="mt-6">
            <h4 className="text-[#1EAEDB] font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/iyffa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#1EAEDB] transition-colors"
                aria-label="Follow us on Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} size="xl" />
              </a>
              <a 
                href="https://facebook.com/iyffa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#1EAEDB] transition-colors"
                aria-label="Follow us on Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
              <a 
                href="https://twitter.com/iyffa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#1EAEDB] transition-colors"
                aria-label="Follow us on Twitter"
              >
                <FontAwesomeIcon icon={faXTwitter} size="lg" />
              </a>
              <a 
                href="https://tiktok.com/@iyffa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#1EAEDB] transition-colors"
                aria-label="Follow us on TikTok"
              >
                <FontAwesomeIcon icon={faTiktok} size="lg" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto mt-12 pt-8 border-t border-[#1EAEDB]/20">
        <div className="flex flex-wrap justify-center gap-8 text-sm text-white">
          <Link to="/about#contact" className="hover:text-[#1EAEDB]">Contact</Link>
          <Link to="/terms" className="hover:text-[#1EAEDB]">Terms and Conditions</Link>
          <Link to="/statutes" className="hover:text-[#1EAEDB]">Association Statutes</Link>
        </div>
      </div>
    </footer>
  );
};
