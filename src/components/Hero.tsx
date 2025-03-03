
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="bg-[#1A1F2C] py-20 px-4 animate-fade-in">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1EAEDB] mb-6">
          Empowering Young Voices in Action
        </h1>
        <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
          Join IYFFA, a youth-led non-profit organization dedicated to empowering young people to create positive change in their communities through leadership and social innovation.
        </p>
        <div className="justify-center gap-4 flex flex-col md:flex-row w-3/4 mx-auto">
        <Button className="bg-[#1EAEDB] text-white hover:bg-[#1EAEDB]/70 text-lg px-8 py-6">
          <Link to="/membership" className="flex items-center">
            Join Our Movement <ArrowRight className="ml-2" />
          </Link>
        </Button>
        <Button className="bg-[#1EAEDB] text-white hover:bg-[#1EAEDB]/70 text-lg px-8 py-6">
          <Link to="/donations" className="flex items-center">
            Make a donation <ArrowRight className="ml-2" />
          </Link>
        </Button>
        </div>
      </div>
    </section>
  );
};
