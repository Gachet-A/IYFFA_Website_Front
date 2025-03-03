/*PAGE DONATION*/
/*Cette page permet au utilisateur de faire une donation*/
/*C'est sur cette page que seront ajouté les fonctionnalités de payment pour les donations*/
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign } from "lucide-react";

const Donations = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">Support Youth Empowerment</h1>
        <p className="text-[#FEF7CD] text-lg max-w-2xl mx-auto">
          Your donation helps us empower young leaders and create positive change in communities worldwide.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader className="text-center">
            <Heart className="w-12 h-12 text-[#1EAEDB] mx-auto mb-4" />
            <CardTitle className="text-[#1EAEDB]">One-Time Gift</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-white mb-4">Make an immediate impact with a one-time donation.</p>
            <Button className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90">Donate Now</Button>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader className="text-center">
            <DollarSign className="w-12 h-12 text-[#1EAEDB] mx-auto mb-4" />
            <CardTitle className="text-[#1EAEDB]">Monthly Support</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-white mb-4">Become a monthly donor to sustain our programs.</p>
            <Button className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90">Give Monthly</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donations;
