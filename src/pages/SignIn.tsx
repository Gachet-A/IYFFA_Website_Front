/*PAGE DE CONNEXION*/
/*Cette page servira de page de connexion a l'espace utilisateur pour les membres de l'association ayant un compte*/

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorTimer, setErrorTimer] = useState<NodeJS.Timeout | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  //Efface le message d'erreur quand les champs du formulaire changent ou après 7 secondes
  useEffect(() => {
    if (error) {
      setError("");
      if (errorTimer) clearTimeout(errorTimer);
    }
  }, [formData]);

  // Efface l'error timer sur le composant unmount
  useEffect(() => {
    return () => {
      if (errorTimer) clearTimeout(errorTimer);
    };
  }, [errorTimer]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    // Valide l'email avant la soumission
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
      emailInputRef.current?.focus();
      return;
    }
    
    // Ceci est une simulation de connexion qui a vocation a être remplacé par un vrai mécanisme d'authentification
    const isValidUser = false; // Simule un échec de connexion 
    
    if (!isValidUser) {
      setError("Invalid email or password. Please try again.");
      
      // Active un timer qui doit effacer le message d'erreur après 7 secondes
      const timer = setTimeout(() => {
        setError("");
      }, 7000);
      
      setErrorTimer(timer);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailError("");
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#1EAEDB]">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-md flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-white text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  ref={emailInputRef}
                  className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                  required
                  placeholder="Enter your email"
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-white flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-[#1EAEDB] hover:underline text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                  required
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
              >
                Sign In
              </Button>

              <p className="text-center text-white text-sm mt-6">
                Not a member yet?{" "}
                <Link
                  to="/membership"
                  className="text-[#1EAEDB] hover:underline font-medium"
                >
                  Apply for membership
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
