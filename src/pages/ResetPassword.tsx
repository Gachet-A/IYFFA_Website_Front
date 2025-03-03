
/*PAGE DE REINITIALISATION DU MOT DE PASSE*/
/*Permet a un utilisateur de réinitialiser son mot de passe */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isTokenChecking, setIsTokenChecking] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extraction du token et le user ID de l'URL
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const userId = searchParams.get('uid');

  //Valide le token sur le composant mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !userId) {
        setIsTokenValid(false);
        setIsTokenChecking(false);
        return;
      }

      try {
        //Ici il sera fait un appel API au backend Django pour valider le token
        // Le code suivant tient le de placeholder pour la futur implémentation
        const response = await fetch(`/api/validate-reset-token?token=${token}&uid=${userId}`);
        const data = await response.json();
        
        setIsTokenValid(response.ok);
      } catch (error) {
        console.error('Error validating token:', error);
        setIsTokenValid(false);
      } finally {
        setIsTokenChecking(false);
      }
    };

    validateToken();
  }, [token, userId]);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    
    // Check for at least one number
    if (!/\d/.test(pass)) {
      return "Password must contain at least one number.";
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pass)) {
      return "Password must contain at least one special character.";
    }
    
    return "";
  };

  const handlePasswordBlur = () => {
    if (password) {
      setPasswordError(validatePassword(password));
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valide le mot de passe
    const passError = validatePassword(password);
    if (passError) {
      setPasswordError(passError);
      return;
    }
    
    // Invalide le mot de passe
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Ici il sera fait un appel API au backend Django pour réinitialiser le mot de passe
        // Le code suivant tient le de placeholder pour la futur implémentation
      const response = await fetch('/api/reset-password-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          uid: userId, 
          new_password: password 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Password reset successful",
          description: "Your password has been reset. You can now log in with your new password.",
        });
        
        // Rediriger a la connexion après 3 secondes
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Montre l'état de chargement pendant la validation du token
  if (isTokenChecking) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 text-[#1EAEDB] animate-spin mb-4" />
              <p className="text-white">Validating your reset link...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (isTokenValid === false) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-red-500">
                Invalid or Expired Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 py-4">
                <div className="bg-red-900/30 border border-red-500/50 rounded-md p-4 text-center">
                  <p className="text-white">
                    The password reset link is invalid or has expired. Reset links are valid for 30 minutes.
                  </p>
                </div>
                
                <div className="text-center">
                  <Link to="/forgot-password">
                    <Button className="mt-4 bg-[#1EAEDB] hover:bg-[#1EAEDB]/90">
                      Request a new reset link
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#1EAEDB]">
              Set New Password
            </CardTitle>
            <CardDescription className="text-white/70 mt-2">
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    onBlur={handlePasswordBlur}
                    className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                    required
                    placeholder="Enter your new password"
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError("");
                    }}
                    onBlur={handleConfirmPasswordBlur}
                    className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                    required
                    placeholder="Confirm your new password"
                  />
                  {confirmPasswordError && (
                    <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
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
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6 py-4">
                <div className="bg-green-900/30 border border-green-500/50 rounded-md p-4 text-center flex flex-col items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-white">
                    Your password has been reset successfully. You will be redirected to the login page shortly.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
