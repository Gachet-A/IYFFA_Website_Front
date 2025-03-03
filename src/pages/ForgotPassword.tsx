/*PAGE DE MOT DE PASSE OUBLIE*/
/*Cette page permet de récupérer un accès si le mot de passe est oublié*/

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //permet de s'assurer de la validité de l'email
    return emailRegex.test(email);
  };

  //Permet d'indique le comportement à suivre si l'email n'est pas valide
  const handleBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      //C'est ici que nous ferons un appel a API au backend Django
      //C'est zone sert de placeholder en attendant que la connexion front back se fasse
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Reset link sent",
          description: `We've sent a password reset link to ${email}`,
        });
      } else {
        // Gestion des cas ou l'email n'est pas trouvé en base de données
        toast({
          title: "Error",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to send reset link. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#1EAEDB]">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-white/70 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    onBlur={handleBlur}
                    className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                    required
                    placeholder="Enter your registered email"
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6 py-4">
                <div className="bg-green-900/30 border border-green-500/50 rounded-md p-4 text-center">
                  <p className="text-white">
                    Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                  </p>
                </div>
                
                <div className="text-center">
                  <Button
                    variant="outline"
                    className="mt-4 border-[#1EAEDB]/20 text-[#1EAEDB]"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Try another email
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link
                to="/signin"
                className="text-[#1EAEDB] hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
