/*PAGE A PROPOS */
/*Cette page présente les membres de l'association*/

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { isValidEmail } from "@/lib/validation";

const officials = [
  {
    name: "Sarah Johnson",
    role: "President",
    image: "/placeholder.svg"
  },
  {
    name: "Michael Chen",
    role: "Vice President",
    image: "/placeholder.svg"
  },
  {
    name: "Elena Rodriguez",
    role: "Secretary General",
    image: "/placeholder.svg"
  },
  {
    name: "David Kim",
    role: "Treasurer",
    image: "/placeholder.svg"
  }
];

const About = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  /*Fonction permettant de soumettre un formulaire */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /*Le code ci-dessous permet de vérifier que l'email est valide et renvoi un message si ce n'est pas le cas*/
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8 border-b border-[#1EAEDB]/20 pb-8">
        <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">About IYFFA</h1>
        <p className="text-white text-lg max-w-2xl mx-auto">
          Meet our dedicated team of officials leading the International Youth Future Founders Association.
        </p>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">Comity</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8 border-b border-[#1EAEDB]/20 pb-8">
        {officials.map((official) => (
          <Card key={official.name} className="bg-[#1A1F2C] border-[#1EAEDB]/20">
            <CardContent className="p-6">
              <img
                src={official.image}
                alt={official.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-[#1EAEDB] mb-2">{official.name}</h3>
              <p className="text-white">{official.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div id="contact" className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#1EAEDB] mb-6 text-center">Contact Us</h2>
        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-white mb-2">First Name</label>
                  <Input
                    id="firstName"
                    required
                    className="bg-[#222222] border-[#1EAEDB] text-white"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-white mb-2">Last Name</label>
                  <Input
                    id="lastName"
                    required
                    className="bg-[#222222] border-[#1EAEDB] text-white"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-white mb-2">Email</label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="bg-[#222222] border-[#1EAEDB] text-white"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-white mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  style={{ border: "1px solid #1EAEDB" }}
                  className="w-full rounded-md bg-[#222222] border-[#1EAEDB] text-white p-3 resize-none"
                />
              </div>
              <Button type="submit" className="w-full bg-[#1EAEDB] text-white hover:bg-[#1EAEDB]/70">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
