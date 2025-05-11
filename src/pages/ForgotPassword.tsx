/*PAGE DE MOT DE PASSE OUBLIE*/
/*Cette page permet de récupérer un accès si le mot de passe est oublié*/

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, AlertCircle, CheckCircle, Mail } from "lucide-react";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenChecking, setIsTokenChecking] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !emailParam) {
        setIsTokenValid(false);
        return;
      }

      setIsTokenChecking(true);
      try {
        const response = await fetch(`/api/auth/reset-password/?token=${token}&email=${emailParam}`);
        const data = await response.json();

        if (response.ok && data.valid) {
          setIsTokenValid(true);
          setEmail(emailParam);
        } else {
          setIsTokenValid(false);
          setError(data.error || "Invalid or expired link");
        }
      } catch (error) {
        setIsTokenValid(false);
        setError("Failed to validate reset link. Please try again.");
      } finally {
        setIsTokenChecking(false);
      }
    };

    validateToken();
  }, [token, emailParam]);

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
          description: "Password reset instructions sent to your email",
        });
        setEmail("");
      } else {
        setError(data.error || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your password has been reset successfully",
        });
        navigate("/signin");
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isTokenChecking) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1EAEDB]"></div>
              <p className="text-white">Validating reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (token && !isTokenValid) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto bg-[#1A1F2C] border-[#1EAEDB]/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#1EAEDB]">Invalid or Expired Link</CardTitle>
            <CardDescription className="text-white">
              {error || "This password reset link is invalid or has expired."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-md mx-auto bg-[#1A1F2C] border-[#1EAEDB]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#1EAEDB]">
            {token ? "Reset Your Password" : "Forgot Password"}
          </CardTitle>
          <CardDescription className="text-white">
            {token
              ? "Please enter your new password below"
              : "Enter your email address and we'll send you a link to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-white text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={token ? handleResetPassword : handleRequestReset} className="space-y-6">
            {!token && (
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
            )}

            {token && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                    required
                    placeholder="Enter your new password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#2A2F3C] text-white border-[#1EAEDB]/20"
                    required
                    placeholder="Confirm your new password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
