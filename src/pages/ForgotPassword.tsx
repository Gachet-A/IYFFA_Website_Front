/*PAGE DE MOT DE PASSE OUBLIE*/
/*Cette page permet de récupérer un accès si le mot de passe est oublié*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, AlertCircle } from "lucide-react";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/auth/request-password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "If an account exists with this email, you will receive a password reset link.",
        });
        navigate("/signin");
      } else {
        setError(data.error || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-md mx-auto bg-[#1A1F2C] border-[#1EAEDB]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#1EAEDB]">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-white">
            Enter your email address and we'll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-white text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
