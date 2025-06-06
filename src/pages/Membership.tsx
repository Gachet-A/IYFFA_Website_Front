/*PAGE DE MEMBERSHIP*/
/*Cette page permet de s'enregistrer en tant que membre de l'association*/

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Membership = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    
    acceptTerms1: false,
    acceptTerms2: false,
    acceptTerms3: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate terms acceptance
      if (!formData.acceptTerms1) {
        toast({
          title: "Error",
          description: "You must accept the terms and conditions to register.",
          variant: "destructive",
        });
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          surname: formData.surname,
          dateOfBirth: formData.dateOfBirth,
          phone: formData.phone,
          acceptTerms1: formData.acceptTerms1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast({
        title: "Success",
        description: "Registration successful! Please wait for admin approval.",
      });

      // Redirect to home page after successful registration
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Registration failed',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name as keyof typeof formData] }));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">Become a Member</h1>
        <p className="text-[#FEF7CD] text-lg max-w-2xl mx-auto">
          Join our global community of young changemakers and make a difference in your community.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto bg-[#1A1F2C] border-[#1EAEDB]/20">
        <CardHeader>
          <CardTitle className="text-[#1EAEDB] text-2xl">Membership Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-white">Surname</label>
                <Input
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white">Date of Birth</label>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-white">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-white">Phone Number</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                required
              />
            </div>

            

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms1"
                  checked={formData.acceptTerms1}
                  onCheckedChange={() => handleCheckboxChange("acceptTerms1")}
                  className="border-[#1EAEDB]"
                />
                <label htmlFor="terms1" className="text-white text-sm">
                  I accept the{' '}
                  <a href="/terms" className="text-[#1EAEDB] hover:underline">
                    Terms & Data Protection Policy
                  </a>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms2"
                  checked={formData.acceptTerms2}
                  onCheckedChange={() => handleCheckboxChange("acceptTerms2")}
                  className="border-[#1EAEDB]"
                />
                <label htmlFor="terms2" className="text-white text-sm">
                  I agree to receive communications from IYFFA
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms3"
                  checked={formData.acceptTerms3}
                  onCheckedChange={() => handleCheckboxChange("acceptTerms3")}
                  className="border-[#1EAEDB]"
                />
                <label htmlFor="terms3" className="text-white text-sm">
                  I confirm that I am at least 16 years old
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Membership;
