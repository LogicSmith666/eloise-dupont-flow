
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { resetPassword, loading } = useAuth();

  const handleSendResetEmail = async () => {
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      setIsResetSent(true);
      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    setIsChanging(true);
    
    try {
      // In a real app, this would call an API to change the password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      
      setNewPassword("");
      setIsResetSent(false);
      setIsConfirmDialogOpen(false);
    } catch (error) {
      console.error("Password change error:", error);
      toast({
        variant: "destructive",
        title: "Failed to change password",
        description: "Please try again later.",
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button
              onClick={handleSendResetEmail}
              className="w-full"
              disabled={!email || loading || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Email"}
            </Button>
            
            {isResetSent && (
              <div className="mt-6 space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">
                    Reset email sent to {email}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                
                <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      disabled={!newPassword || isChanging}
                    >
                      Change Password
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Password Change</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to change your password? You'll need to use the new password to log in.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handlePasswordChange}
                        disabled={isChanging}
                      >
                        {isChanging ? "Changing..." : "Confirm"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              <Link
                to="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
