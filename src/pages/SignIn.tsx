/*PAGE DE CONNEXION*/
/*Cette page servira de page de connexion a l'espace utilisateur pour les membres de l'association ayant un compte*/

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Lock, AlertCircle, KeySquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorTimer, setErrorTimer] = useState<NodeJS.Timeout | null>(null);
  const [isOtpRequired, setIsOtpRequired] = useState(false);
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

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.otp_required) {
        setIsOtpRequired(true);
        toast({
          title: "Check your email",
          description: "We've sent you a verification code.",
        });
      } else {
        // Use the login function from AuthContext with the complete user data
        login(data.access, data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      const timer = setTimeout(() => setError(""), 7000);
      setErrorTimer(timer);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      // Use the login function from AuthContext with the complete user data
      login(data.access, data.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
      const timer = setTimeout(() => setError(""), 7000);
      setErrorTimer(timer);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
      emailInputRef.current?.focus();
      return;
    }

    if (isOtpRequired) {
      await handleVerifyOtp();
    } else {
      await handleLogin();
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
              {isOtpRequired ? "Enter Verification Code" : "Sign In"}
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
              {!isOtpRequired ? (
                <>
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
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-white flex items-center gap-2">
                    <KeySquare className="w-4 h-4" />
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                    required
                    placeholder="Enter the code from your email"
                    maxLength={6}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
              >
                {isOtpRequired ? "Verify Code" : "Sign In"}
              </Button>

              {!isOtpRequired && (
                <p className="text-center text-white text-sm mt-6">
                  Not a member yet?{" "}
                  <Link
                    to="/membership"
                    className="text-[#1EAEDB] hover:underline font-medium"
                  >
                    Apply for membership
                  </Link>
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
