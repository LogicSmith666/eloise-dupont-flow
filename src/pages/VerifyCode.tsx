
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const { verifyLoginCode, resendLoginCode, pendingUser, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if no pending user
  useEffect(() => {
    if (!pendingUser) {
      navigate('/login');
    }
  }, [pendingUser, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleVerify = async () => {
    if (code.length !== 6) return;
    
    setIsVerifying(true);
    
    try {
      await verifyLoginCode(code);
      // The redirect will happen in the AuthContext based on user role
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "The code you entered is incorrect or has expired. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      await resendLoginCode();
      setTimeLeft(60);
      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      console.error("Resend error:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to resend the code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCancel = () => {
    logout();
    navigate('/login');
  };

  if (!pendingUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Verification Required</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {pendingUser.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} index={index} />
                    ))}
                  </InputOTPGroup>
                )}
              />
              
              <div className="text-center text-sm text-muted-foreground mt-2">
                {timeLeft > 0 ? (
                  <p>Code expires in {timeLeft} seconds</p>
                ) : (
                  <p>Your code has expired</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={code.length !== 6 || isVerifying || loading}
            >
              {isVerifying ? "Verifying..." : "Verify & Login"}
            </Button>
            
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={timeLeft > 0 || isResending}
                className="flex-1 mr-2"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 ml-2"
              >
                Cancel
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VerifyCode;
